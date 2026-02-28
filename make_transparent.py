from PIL import Image
import sys

def make_transparent(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening image: {e}")
        sys.exit(1)
        
    datas = img.getdata()
    
    newData = []
    # Make white (and near white) pixels transparent
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Transparent image saved to {output_path}")

if __name__ == "__main__":
    make_transparent(
        r"C:\Users\TechShack\.gemini\antigravity\brain\5c986c3a-1f42-4a3a-96a4-fe18584e5165\media__1772303434207.png",
        r"C:\Users\TechShack\Desktop\TCEMS\public\logo.png"
    )
