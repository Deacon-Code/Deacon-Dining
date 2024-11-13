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

Date = date.today()
begin_month = Date.strftime("%m")
begin_day = Date.strftime("%d")
Date = Date + timedelta(days=4)
end_month = Date.strftime("%m")
end_day = Date.strftime("%d")
pdf_url = "https://dining.wfu.edu/wp-content/uploads/2017/07/{begin_month}{begin_day}-{end_month}{end_day}-Mag-Room-Menu.pdf"
extracted_text = get_text_from_pdf(pdf_url)
print(extracted_text)
