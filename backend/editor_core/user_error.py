class UserError(Exception):
    """ Errors to be displayed to the user when it occurs """
    def __init__(self, message):
        super().__init__(message)
        self.message = message
