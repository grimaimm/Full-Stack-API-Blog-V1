import re

def ValidateUserPassword(password):
    if len(password) < 8:
        return "Password harus minimal 8 karakter"
    if not re.search(r"[A-Z]", password):
        return "Password harus mengandung setidaknya 1 huruf besar"
    if not re.search(r"[a-z]", password):
        return "Password harus mengandung setidaknya 1 huruf kecil"
    if not re.search(r"[0-9]", password):
        return "Password harus mengandung setidaknya 1 angka"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Password harus mengandung setidaknya 1 karakter khusus"
    return None