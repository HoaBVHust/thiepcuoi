#!/usr/bin/env python3
"""Server xem thử thiệp cưới trên máy (không lưu cache — luôn tải bản mới nhất).

Cách dùng:  python tools/dev-server.py  [cổng=8644]
Sau đó mở  http://localhost:8644  trong trình duyệt.
"""
import functools
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8644


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=".")
    print(f"Đang chạy tại http://localhost:{PORT} (Ctrl+C để dừng)")
    http.server.test(HandlerClass=handler, port=PORT)
