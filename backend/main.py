import os
import glob
from functools import reduce

from lib.dir_loader import DirLoader
from lib.ffuf import FFUF
from lib.utilities import normalize_str

SECLISTS_PATH = "./seclists"

dl = DirLoader(SECLISTS_PATH)
ffuf = FFUF(SECLISTS_PATH)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typings.fuzz_body import FuzzBody

app = FastAPI()

origins = [
	"http://localhost:3000"
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"]
)

@app.get("/api/kill")
def kill():
	if ffuf.running_proc is not None:
		ffuf.kill_running_proc()

	return { "success": True }

@app.get("/api/params")
def get_params():
	seclists_dict = dl.get_seclist_dict("./seclist_dict.json")
	return seclists_dict

@app.post("/api/fuzz")
def fuzz_url(fuzz_body: FuzzBody):
	input_options = fuzz_body.input_options if type(fuzz_body.input_options) is dict else fuzz_body.input_options.dict()
	matcher_options = fuzz_body.matcher_options.dict() if fuzz_body.matcher_options is not None else None
	filter_options = fuzz_body.filter_options.dict() if fuzz_body.filter_options is not None else None

	if filter_options is not None:
		for opt in filter_options:
			if filter_options[opt] is None:
				continue
			if opt.endswith("codes") or opt.endswith("counts") or opt.endswith("sizes"):
				filter_options[opt] = normalize_str(filter_options[opt])

	# print(matcher_options)

	try:
		results = ffuf.run(
			url_dict=fuzz_body.url_dict.dict(),
			word_lists=[wl.dict() for wl in fuzz_body.word_lists],
			input_options=input_options,
			matcher_options=matcher_options,
			filter_options=filter_options,
			output_file="./outputs/output.json"
		)
	except Exception as e:
		raise HTTPException(status_code=400, detail=str(e))

	if results is None:
		raise HTTPException(status_code=400, detail=str(e))

	return {
		"results": results,
		"file_count": len(glob.glob(SECLISTS_PATH + '/**/*.txt', recursive=True)),
		"word_count": sum([len(open(l.path).readlines()) for l in fuzz_body.word_lists])
	}
