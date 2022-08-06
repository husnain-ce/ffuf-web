from shlex import split as sh_split
from subprocess import CalledProcessError, Popen as proc_exec, TimeoutExpired, run as proc_run
from pathlib import Path
from json import load as json_load
from time import time_ns
import re

"""
TODO:
- Make a separate module for matching, filtering and utils for ffuf
- Clean and optimize code
- Test more
"""

class FFUF:
	def __init__(self, seclists_path):
		self.seclists = Path(seclists_path)
		self.discovery = self.seclists / "Discovery"
		self.fuzzing = self.seclists / "Fuzzing"
		self.default_output_path = self.get_output_file_path("/tmp/ffuf_output.json")

	def get_output_file_path(self, path: str):
		path = Path(path)
		return path.parent.resolve() / f"{path.name}_{time_ns()}{''.join(path.suffixes)}" 

	def add_url(self, url: str, custom_query: str | None):
		return sh_split(f"-u {url}/" + "FUZZ" if custom_query is None else custom_query)

	def add_word_list(self, path: Path, keyword: str | None):
		if not path.exists():
			raise FileNotFoundError() # add meaningful error message later
		
		return sh_split(f"-w {path.resolve().as_posix()}" + (f":{keyword.upper()}" if keyword is not None else ""))

	def add_output_file(self, path: Path):
		if path.name.endswith(".json"):
			return sh_split(f"-of json -o {path.as_posix()}")

		return []

	def add_input_options(self, options: dict):
		opts_str = []

		if options.get("ignore_wordlist_comments"):
			opts_str.append("-ic")

		return sh_split(" ".join(opts_str))

	def validate_http_status_codes(self, status_codes: list[int]):
		return all((type(code) is int and code >= 100 and code <= 599) for code in status_codes)

	def add_matcher_options(self, options: dict):
		opts_str = []

		status_codes = options.get("match_http_status_codes")
		line_count = options.get("match_line_count")
		regexp = options.get("match_regexp")
		res_size = options.get("match_response_size")
		res_time = options.get("match_response_time")
		word_count = options.get("match_word_count")

		if status_codes is not None:
			status_code_type = type(status_codes)
			# if not str or list
			if status_code_type is not str and status_code_type is not list:
				raise ValueError()
			# if str, but not all (only option)
			# commented out because redundant
			# if status_code_type is str and status_codes != "all":
			# 	raise ValueError()
			# if list, but not valid status code numbers
			if status_code_type is list and not self.validate_http_status_codes(status_codes):
				raise ValueError()

			# if list and list has status_codes
			if status_code_type is list and len(status_codes) > 0:
				opts_str.append(f"-mc {','.join([str(code) for code in list(set(status_codes))])}")
			# if list is string and str == "all"
			elif status_code_type is str and status_codes == "all":
				opts_str.append(f"-mc all")
		
		if line_count is not None:
			if type(line_count) is not int or line_count < 0:
				raise ValueError()
			
			opts_str.append(f"-ml {line_count}")
		
		if regexp is not None:
			try:
				re.compile(regexp)
			except re.error:
				raise ValueError()

			opts_str.append(f"-mr {regexp}")

		if res_size is not None:
			if type(res_size) is not int or res_size < 0:
				raise ValueError()

			opts_str.append(f"-ms {res_size}")

		if res_time is not None:
			res_time_expr = re.match(r"(<|>)\d{1,}", res_time)
			if res_time_expr is not None:
				opts_str.append(f"-mt {res_time_expr.group(0)}")
			else:
				raise ValueError()
		
		if word_count is not None:
			if type(word_count) is not int:
				raise ValueError()
			
			opts_str.append(f"-mw {word_count}")
		
		return sh_split(" ".join(opts_str))

	def parse_range(self, range_str):
		if self.is_range(range_str):
			[start, stop] = range_str.split("-")
			if int(start) > int(stop):
				raise ValueError()

			return list(range(int(start), int(stop) + 1))

		raise ValueError()

	def is_range(self, range_str):
		return re.match(r"\d{1,}-\d{1,}", range_str) is not None

	def parse_numeric_filter_lists(self, numeric_filter_lists):
		print(numeric_filter_lists)
		filter_list = []
		for num in numeric_filter_lists:
			if num.isnumeric():
				filter_list.append(int(num))
			elif self.is_range(num):
				filter_list += self.parse_range(num)
			else:
				raise ValueError()
		
		return list(set(filter_list))

	def add_filter_options(self, options: dict):
		opts_str = []

		status_codes = options.get("filter_http_status_codes")
		line_counts = options.get("filter_line_counts")
		regexp = options.get("filter_regexp")
		res_sizes = options.get("filter_response_sizes")
		res_time = options.get("filter_response_time")
		word_counts = options.get("filter_word_counts")

		if status_codes is not None:
			# status_codes.split(",") <- expecting
			if type(status_codes) is not list:
				raise ValueError()
			
			# ranges have been parsed, just validating them is also possible
			status_codes = self.parse_numeric_filter_lists(status_codes)
			if not self.validate_http_status_codes(status_codes):
				raise ValueError()

			# if list and list has status_codes
			if len(status_codes) > 0:
				opts_str.append(f"-fc {','.join([str(code) for code in status_codes])}")
		
		if line_counts is not None:
			# line_counts.split(",") <- expecting
			if type(line_counts) is not list:
				raise ValueError()
			
			# ranges have been parsed, just validating them is also possible
			line_counts = self.parse_numeric_filter_lists(line_counts)
			if any(lc < 0 for lc in line_counts):
				raise ValueError()

			if len(line_counts) > 0:
				opts_str.append(f"-fl {','.join([str(lc) for lc in line_counts])}")
		
		if regexp is not None:
			try:
				re.compile(regexp)
			except re.error:
				raise ValueError()

			opts_str.append(f"-fr {regexp}")

		if res_sizes is not None:
			# line_counts.split(",") <- expecting
			if type(res_sizes) is not list:
				raise ValueError()
			
			# ranges have been parsed, just validating them is also possible
			res_sizes = self.parse_numeric_filter_lists(res_sizes)
			if any(rs < 0 for rs in res_sizes):
				raise ValueError()

			if len(res_sizes) > 0:
				opts_str.append(f"-fs {','.join([str(rs) for rs in res_sizes])}")

		if res_time is not None:
			res_time_expr = re.match(r"(<|>)\d{1,}", res_time)
			if res_time_expr is not None:
				opts_str.append(f"-ft {res_time_expr.group(0)}")
			else:
				raise ValueError()
		
		if word_counts is not None:
			# line_counts.split(",") <- expecting
			if type(word_counts) is not list:
				raise ValueError()
			
			# ranges have been parsed, just validating them is also possible
			word_counts = self.parse_numeric_filter_lists(word_counts)
			if any(wc < 0 for wc in word_counts):
				raise ValueError()

			if len(word_counts) > 0:
				opts_str.append(f"-fw {','.join([str(wc) for wc in word_counts])}")
		
		return sh_split(" ".join(opts_str))

	def get_command(self, url_dict: dict, word_lists: list[dict], input_options: dict | None, matcher_options: dict | None, filter_options: dict | None, output_file: str):
		url = url_dict.get("url")
		custom_query = url_dict.get("query")
		if url is None:
			raise ValueError()

		command = ["ffuf"]
		command += self.add_url(url, custom_query)

		for word_list_dict in word_lists:
			if not word_list_dict:
				raise ValueError()

			word_list_path = word_list_dict.get("path")
			if word_list_path is None:
				raise ValueError()

			command += self.add_word_list(word_list_path, word_list_dict.get("keyword"))

		if bool(input_options):
			command += self.add_input_options(input_options)

		if bool(matcher_options):
			command += self.add_matcher_options(matcher_options)

		if bool(filter_options):
			command += self.add_filter_options(filter_options)
		
		command += self.add_output_file(output_file)

		return command

	def get_ffuf_results(self, output_file: Path):
		with open(output_file, "r") as f:
			return json_load(f)["commandline"]

	"""
		options = {
			url: <url> # only support one url for now
			word_lists: [<word_list_1>, ...],
			input_opts: [<input_opt_1>, ...],
			output_file: <outputfile_path> | "/tmp/ffuf_output.json"
		}
	"""
	def run(self, url_dict: dict, word_lists: list[dict], input_options: dict | None = None, matcher_options: dict | None = None, filter_options: dict | None = None, output_file: str | None = None):
		if not url_dict or not len(word_lists):
			raise ValueError()

		input_options = None if input_options is None or not input_options else input_options
		output_file = self.default_output_path if output_file is None or not len(output_file) else self.get_output_file_path(output_file)

		tokenized_command = self.get_command(url_dict, word_lists, input_options, matcher_options, filter_options, output_file)

		# try:
		# 	proc_run(tokenized_command, check=True)
		# except CalledProcessError as e:
		# 	print(e)

		# ONLY FOR USE IN DEVELOPMENT
		# ADD ENV CHECK HERE
		errs = None

		try:
			proc = proc_exec(tokenized_command).wait()
			# _, errs = proc.communicate()
		except Exception as e:
			print(e)
			proc.kill()
			# _, errs = proc.communicate()

		if errs:
			print(errs)
			return None

		try:
			return self.get_ffuf_results(output_file)
		except Exception as e:
			print(e)
			return None

if __name__ == "__main__":
	_ = FFUF("./seclists")
	normalize_str = lambda x: [_.strip() for _ in x.split(",")]
	r = _.run(
		url_dict={ "url": "http://testphp.vulnweb.com" }, 
		word_lists=[{ "path": _.seclists / "test" / "fuzzing-boom.txt" }], 
		input_options={ "ignore_wordlist_comments": True }, 
		matcher_options={
			# "match_http_status_codes": [200, 300, 301, 400, 401, 402, 403, 404, 500, 501],
			# "match_line_count": 20,
			# "match_regexp": "\.listing",
			# "match_response_size": 10,
			# "match_response_time": "<20",
			# "match_word_count": 5
		},
		filter_options={
			# "filter_http_status_codes": [code.strip() for code in "200, 300, 301, 400-404, 500, 501".split(",")],
			# "filter_line_counts": normalize_str("20, 30, 40-100"),
			# "filter_regexp": ".listing",
			# "filter_response_sizes": normalize_str("500, 200, 100-200"),
			# "filter_response_time": "<20",
			"filter_word_counts": normalize_str("10")
		},
		output_file="./outputs/outputs.json")
	print(r)

# status_codes = options.get("match_http_status_codes")
# line_count = options.get("match_line_count")
# regexp = options.get("match_regexp")
# first_byte_delay = options.get("match_initial_delay")
# word_count = options.get("match_word_count")