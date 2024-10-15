base_url = 'https://e5da-140-247-111-5.ngrok-free.app'

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
import sys

template = """You are a proof assistant for Dafny.
I will give you a piece of Dafny code.
Your task is to output the next line of code.
You may only output Dafny code. Do not output any English sentences.
Here's the code:

{code}
"""

prompt = ChatPromptTemplate.from_template(template)

model = OllamaLLM(model="llama3:8b", base_url=base_url)

chain = prompt | model

filename = sys.argv[1]
with open(filename) as f:
    code = f.read()

print(chain.invoke({"code": code}))
