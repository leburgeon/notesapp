import { useState } from "react";

const Togglable = ({ buttonLabel, children }) => {
  const [isVisible, setIsVisible] = useState(false)

  const showWhenVisible = {display : isVisible ? '' : 'none'}
  const hideWhenVisible = {display : isVisible ? 'none' : ''}

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>Cancel {buttonLabel}</button>
      </div>
    </div>
  )
}

export default Togglable