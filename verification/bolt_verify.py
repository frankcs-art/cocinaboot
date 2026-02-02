from playwright.sync_api import sync_playwright
import time
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(ignore_https_errors=True)
        page = context.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})

        print("Navigating to https://localhost:3000...")
        try:
            page.goto("https://localhost:3000", timeout=60000)
            print("Page loaded. Checking for login...")

            # Wait for either main or login button
            time.sleep(5)

            login_button = page.get_by_text("Continuar con Google")
            if login_button.is_visible():
                print("Login button visible. Clicking...")
                login_button.click()
                time.sleep(5)

            # Now wait for main
            print("Waiting for main content...")
            page.wait_for_selector("main", timeout=30000)
            print("Dashboard visible.")
            page.screenshot(path="verification/bolt_01_dashboard.png")

            # 2. Inventory
            print("Navigating to Inventory...")
            page.get_by_role("button", name="INVENTARIO").click()
            time.sleep(3)
            page.screenshot(path="verification/bolt_02_inventory.png")

            # 3. Search
            print("Testing search...")
            page.fill("input[placeholder='Buscar...']", "Jamón")
            time.sleep(3)
            page.screenshot(path="verification/bolt_03_search.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/bolt_error_state.png")

        browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    run_verification()
