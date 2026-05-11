from playwright.sync_api import sync_playwright
import time

def take_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # Navigate to homepage
        page.goto('http://localhost:3004')
        time.sleep(2)

        page.screenshot(path='/home/jules/verification/screenshots/homepage_navbar.png')

        browser.close()

take_screenshot()
