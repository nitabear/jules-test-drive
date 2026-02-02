def add(a, b):
    return a + b

def divide(a, b):
    # Intentional Bug: This will crash if b is 0
    # And it currently returns a * b by mistake!
    return a * b 

print("Result of 10 + 5:", add(10, 5))
print("Result of 10 / 2:", divide(10, 2))
