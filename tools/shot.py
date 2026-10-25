"""Screenshot helper for checking the site locally.
python3 tools/shot.py <url> <out.png> <wait_ms> [w] [h] [hoverX hoverY]
"""
import sys, asyncio
from playwright.async_api import async_playwright

url, out, wait = sys.argv[1], sys.argv[2], int(sys.argv[3])
w = int(sys.argv[4]) if len(sys.argv) > 4 else 1440
h = int(sys.argv[5]) if len(sys.argv) > 5 else 900
hover = (int(sys.argv[6]), int(sys.argv[7])) if len(sys.argv) > 7 else None

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        pg = await b.new_page(viewport={"width": w, "height": h})
        logs = []
        pg.on("console", lambda m: logs.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: logs.append(f"pageerror: {e}"))
        await pg.goto(url)
        if hover:
            await pg.wait_for_timeout(wait // 2)
            await pg.mouse.move(hover[0] - 200, hover[1] - 100)
            await pg.mouse.move(hover[0], hover[1], steps=10)
            await pg.wait_for_timeout(wait // 2)
        else:
            await pg.wait_for_timeout(wait)
        await pg.screenshot(path=out, timeout=120000)
        for l in logs[:15]:
            print(l)
        await b.close()

asyncio.run(main())
