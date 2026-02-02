def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

print("Result of 10 + 5:", add(10, 5))
print("Result of 10 / 2:", divide(10, 2))
