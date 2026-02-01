import time
from playwright.sync_api import sync_playwright, expect

def verify_jules_auth_and_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"BROWSER ERROR: {err}"))

        print("Navigating to http://localhost:3000...")
        try:
            page.goto("http://localhost:3000", timeout=60000)
            time.sleep(5) # Give it some time to process
            page.screenshot(path="verification/auth_debug_2.png")

        except Exception as e:
            print(f"Exception: {e}")

        browser.close()

if __name__ == "__main__":
    verify_jules_auth_and_ui()
