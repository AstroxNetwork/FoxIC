import React, { useState } from "react"
import { ReactElement } from "react"
import { useCopyToClipboard } from "react-use-copy-to-clipboard"

type CopyProps = {
  text: string
  content: string | ReactElement
  onSuccess?: () => void
}

const Copy: React.FC<CopyProps> = (props) => {
  const { content, text } = props
  const [toastText, setToastText] = useState("")
  const clickRef = useCopyToClipboard(
    text,
    () => {
      setToastText('Copied!')
      setTimeout(() => {
        setToastText('')
      }, 2000)
      // Toast.show({
      //   icon: 'success',
      //   content: 'Copied!',
      // });
      props.onSuccess && props.onSuccess()
    },
    () => {
      setToastText('Unable to copy!')
      setTimeout(() => {
        setToastText('')
      }, 2000)
      // Toast.show({
      //   icon: 'fail',
      //   content: 'Unable to copy!',
      // }),
    },
  )
  // if(React.isValidElement(content)) {
  //   return
  // }
  return (
    <div style={{ cursor: "pointer" }} ref={clickRef}>
      {content}
      {toastText ? (
        <div
          className="toast-copy"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        >
          <div className="toast-copy-content" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            display: 'inline-block',
            backgroundColor: '#6B6B6B',
            padding: '10px 20px',
            borderRadius: 6,
          }}>{toastText}</div>
        </div>
      ) : null}
    </div>
  )
}

export default Copy
