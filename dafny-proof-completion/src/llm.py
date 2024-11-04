import sys
import os
import subprocess
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
import xml.etree.ElementTree as ET

os.environ["PATH"] = "C:\\Program Files\\dafny-4.8.1-x64-windows-2019\\dafny"


def get_code_idx(code, line, char):
    l = 0
    c = 0
    for i in range(len(code)):
        if l == line:
            if c == char:
                return i
            c += 1
        if code[i] == '\n':
            l += 1


filename = sys.argv[1]
line_pos = int(sys.argv[2])
char_pos = int(sys.argv[3])
action = sys.argv[4]

match action:
    case 'complete':
            
        offset = int(sys.argv[3])

        verifier_output = subprocess.run(['dafny', '/compile:0', '/xml:dafny_output.xml', filename], capture_output=True, text=True).stdout
        # verify_result = subprocess.run(['dafny', 'verify', filename], capture_output=True, text=True).stdout
        root = ET.parse('dafny_output.xml').getroot()
        os.remove('dafny_output.xml')

        errors = []
        for child in root:
            if child.tag == 'error':
                errors.append(child.attrib)
        
        if not errors:
            if 'Dafny program verifier finished with' in verifier_output:
                print('verifies')
            else:
                print('non-verification error')
            sys.exit(0)

        template = """You are a proof assistant for Dafny.
        I will give you a piece of Dafny code.
        One section of the code contains <insert code here>.
        Your task is to replace this with a verification statement.
        Please output the Dafny code that you would place here.
        You may only output Dafny code. Do not output any English sentences.
        Your statement must be either an existing lemma in the code, or a statement beginning with assert.
        Here's the code:

        {code}
        """

        prompt = ChatPromptTemplate.from_template(template)
        model = OllamaLLM(model="llama3:8b", base_url='https://a102-140-247-111-5.ngrok-free.app')
        chain = prompt | model
        with open(filename) as f:
            code = f.read()
        code_idx = get_code_idx(code, line_pos, char_pos)
        code_modified = code[:code_idx] + '<insert code here>' + code[code_idx:]
        llm_output = chain.invoke({"code": code_modified})
        
        print('suggestion')
        print(llm_output, end='')


    case 'goto':

        subprocess.run(['dafny', '/compile:0', '/xml:dafny_output.xml', filename], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        root = ET.parse('dafny_output.xml').getroot()
        os.remove('dafny_output.xml')
        min_dist = None
        goto_line = None
        for child in root:
            if child.tag == 'error':
                if child.attrib['message'] in ('assertion violation', 'postcondition violation'):
                    line = int(child.attrib['line'])
                    dist = abs(line_pos - line)
                    if min_dist is None or dist < min_dist:
                        min_dist = dist
                        goto_line = int(child.attrib['line'])
                else:
                    raise NotImplementedError
        print(goto_line if goto_line else -1, end='')
