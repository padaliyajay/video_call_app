import PropTypes from "prop-types";

export function Container({ children, className = "", ...props }) {
    return (
        <div className={`${className} container px-4 mx-auto`} {...props}>
            {children}
        </div>
    )
}

Container.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};