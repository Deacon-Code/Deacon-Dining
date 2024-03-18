import requests
from PyPDF2 import PdfReader

def get_text_from_pdf(pdf_url):
    text = ""
    response = requests.get(pdf_url)
    with open("temp_pdf.pdf", "wb") as pdf_file:
        pdf_file.write(response.content)
    with open("temp_pdf.pdf", "rb") as file:
        reader = PdfReader(file)
        num_pages = len(reader.pages)
        for page_num in range(num_pages):
            page = reader.pages[page_num]
            text += page.extract_text()
    return text

pdf_url = "https://dining.wfu.edu/wp-content/uploads/2024/03/mag-room-mar4-7.pdf"
extracted_text = get_text_from_pdf(pdf_url)
print(extracted_text)
