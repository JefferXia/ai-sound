'use client'

const AudioPlayingLoader = () => {
    
  return (
    <div className="">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="24px" height="24px" viewBox="0 0 24 24" enableBackground="new 0 0 50 50" xmlSpace="preserve">
        <rect x="0" y="0" width="4" height="7" fill="#24A0ED">
          <animateTransform  attributeType="xml"
            attributeName="transform" type="scale"
            values="1,1; 1,3; 1,1"
            begin="0s" dur="0.6s" repeatCount="indefinite" />       
        </rect>

        <rect x="10" y="0" width="4" height="7" fill="#24A0ED">
          <animateTransform  attributeType="xml"
            attributeName="transform" type="scale"
            values="1,1; 1,3; 1,1"
            begin="0.2s" dur="0.6s" repeatCount="indefinite" />       
        </rect>
        <rect x="20" y="0" width="4" height="7" fill="#24A0ED">
          <animateTransform  attributeType="xml"
            attributeName="transform" type="scale"
            values="1,1; 1,3; 1,1"
            begin="0.4s" dur="0.6s" repeatCount="indefinite" />   
        </rect>
      </svg>
    </div>
  )
}

export default AudioPlayingLoader
