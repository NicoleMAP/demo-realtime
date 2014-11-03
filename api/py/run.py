import tornado.ioloop
import tornado.web
import sys


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

if sys.argv[1:]:
    port = int(sys.argv[1])
else:
    port = 8000

application = tornado.web.Application([
    (r"/", MainHandler),
])

if __name__ == "__main__":
    application.listen(port=port, address='192.168.33.2')
    tornado.ioloop.IOLoop.instance().start()
