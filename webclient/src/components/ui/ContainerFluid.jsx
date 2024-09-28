import PropTypes from "prop-types";

export function ContainerFluid({ children, className = "", ...props }) {
    return (
        <div className={`${className} px-4`} {...props}>
            {children}
        </div>
    )
}

ContainerFluid.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};