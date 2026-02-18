import time

def log_message(message: str, filename: str = "app.log"):
    """
    Logs a message to a specified file.
    Uses 'with open' for robust file handling.
    """
    with open(filename, "a") as f:
        f.write(f"[{time.time()}] {message}\n")

def process_data(data: list[int]) -> list[int]:
    """
    Processes a list of numerical data by multiplying each item by 2.
    Logs errors for non-numerical items and substitutes with 0.
    """
    processed = []
    for item in data:
        try:
            processed.append(item * 2)
        except TypeError as e: # Catch TypeError for non-numerical data
            log_message(f"Error processing item {item}: {e}. Substituting with 0.")
            processed.append(0)
    return processed

def main():
    """
    Main function to run the application logic.
    """
    log_message("Application started.")

    # Ensure raw_data contains only numerical values.
    # Changed "forty" to 40 for numerical consistency.
    raw_data: list[int] = [1, 2, 3, 40, 5]
    processed_result = process_data(raw_data)
    log_message(f"Processed data: {processed_result}")

    factor_val: int = 100
    divisor_input: int = 0

    try:
        user_input = input("Enter a divisor: ")
        divisor_input = int(user_input)
    except ValueError:
        log_message("Invalid divisor input. Using default 0.")
        divisor_input = 0

    final_factor: float = 0.0 # Initialize with a default fallback value

    # Implement try-except ZeroDivisionError for final_factor calculation.
    try:
        final_factor = factor_val / divisor_input
    except ZeroDivisionError:
        log_message("ZeroDivisionError: Attempted to divide by zero. Setting final_factor to 0.")
        final_factor = 0.0 # Fallback value for zero division

    log_message(f"Final factor calculated: {final_factor}")

    log_message("Application finished.")

if __name__ == "__main__":
    main()
