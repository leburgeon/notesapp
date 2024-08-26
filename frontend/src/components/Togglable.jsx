import { useState, forwardRef, useImperativeHandle } from 'react'
// This library is used for setting and checking types and requirements on react components
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [isVisible, setIsVisible] = useState(false)

  const showWhenVisible = { display : isVisible ? '' : 'none' }
  const hideWhenVisible = { display : isVisible ? 'none' : '' }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className='togglableContent'>
        {children}
        <button onClick={toggleVisibility}>Cancel {buttonLabel}</button>
      </div>
    </div>
  )
})

// sets the propTypes options on togglable
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
Togglable.displayName = 'Togglable'

export default Togglable