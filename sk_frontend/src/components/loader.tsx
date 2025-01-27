import "../App.css"

const Loader = ({ size = "medium", color = "blue" }) => {
    const sizeClasses = {
        small: "w-6 h-6 border-2",
        medium: "w-12 h-12 border-4",
        large: "w-16 h-16 border-4",
    };

    const selectedSize = sizeClasses.large;

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${selectedSize} border-4 border-${color}-500 border-t-transparent rounded-full animate-spin`}
            ></div>
        </div>
    );
};

export default Loader;
