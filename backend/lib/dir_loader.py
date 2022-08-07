from pathlib import Path
from json import dump, load

class DirLoader:
	def __init__(self, seclists_path: str):
		self.seclists = Path(seclists_path)
		self.discovery = self.seclists / "Discovery"
		self.fuzzing = self.seclists / "Fuzzing"
		self.seclist_dict = {}

		if not self.seclists.exists():
			raise FileNotFoundError()
		

	def get_nested_items(self, path: Path):
		items = []
		for f in path.iterdir():
			if f.is_dir():
				items += self.get_nested_items(f)
			items.append(f)

		return items

	def add_path_to_dict(self, path: Path):
		tmp_path = self.seclists
		tmp_dict = self.seclist_dict
		for part in path.parts[1:]:
			tmp_path = tmp_path / part
			if part not in tmp_dict:
				if not tmp_path.exists():
					raise FileNotFoundError()
				if tmp_path.is_dir():
					tmp_dict[part] = {}
				else:
					tmp_dict[part] = path.as_posix()
			tmp_dict = tmp_dict[part]


	def get_all_files(self, exceptions: list[str] = []):
		filtered_paths = list(filter(lambda x: x.name not in exceptions, self.get_nested_items(self.seclists)))
		for p in filtered_paths:
			self.add_path_to_dict(p)
		return self.seclist_dict

	def save_seclist_dict(self, json_file_path: str):
		path = Path(json_file_path)

		with open(path, "w") as f:
			return dump(self.seclist_dict, f)

	def generate_seclist_dict(self, exceptions: list[str] = [], json_file_path: str = "./seclist_dict.json"):
		self.get_all_files(exceptions)
		self.save_seclist_dict(json_file_path)

	def get_seclist_dict(self, json_file_path: str):
		path = Path(json_file_path)
		if not path.exists():
			self.generate_seclist_dict(json_file_path=json_file_path)
		else:
			with open(path, "r") as f:
				self.seclist_dict = load(f)
		
		return self.seclist_dict
	
if __name__ == "__main__":
	dl = DirLoader("./seclists")
	print(dl.get_all_files())
	dl.generate_seclist_dict()
		
