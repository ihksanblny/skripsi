import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text_from_docx(docx_path):
    text = []
    with zipfile.ZipFile(docx_path) as docx:
        xml_content = docx.read('word/document.xml')
        tree = ET.XML(xml_content)
        WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        PARA = WORD_NAMESPACE + 'p'
        TEXT = WORD_NAMESPACE + 't'
        for paragraph in tree.iter(PARA):
            texts = [node.text for node in paragraph.iter(TEXT) if node.text]
            if texts:
                text.append(''.join(texts))
    return '\n'.join(text)

try:
    content = extract_text_from_docx(r"d:\New Project\skripsi\2218070-for-semhas.docx")
    with open(r"d:\New Project\skripsi\docx_content.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
