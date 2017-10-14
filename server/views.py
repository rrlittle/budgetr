from flask_restful_swagger_2 import Resource, swagger


class HelloWorld(Resource):
    @swagger.doc({
        "tags": ["test, helloworld", "hello", "world"],
        "description": "test how it all works",
        "responses": {
            "200": {
                "description": "found a thing",
                "examples": {
                    "application/json": {
                        "id": 1
                    }
                }
            }
        }
    })
    def get(self):
        return {'hello': 'world'}
