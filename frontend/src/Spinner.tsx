interface SpinnerProps {
    className?: string; 
  }
  

export function Spinner({className}: SpinnerProps ) {
    const defaultClasses = "mr-3 -ml-1 size-5 animate-spin ";
    // If className is undefined, don't want to append the string "undefined", but rather just an empty string
    const additionalClasses = className || "";

    return (
        <svg
            className={defaultClasses + additionalClasses}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="spinner-circle" />
            <path
                className="spinner-path"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
