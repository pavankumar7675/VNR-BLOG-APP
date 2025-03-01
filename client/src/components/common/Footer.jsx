import React from 'react'

function Footer() {
  return (
    <div style={{
      backgroundColor: '#1A1A1A',
      color: '#EAEAEA',
      padding: '2rem 0',
      marginTop: 'auto',
      borderTop: '1px solid #00FF7F',
      boxShadow: '0 -2px 10px rgba(0, 255, 127, 0.1)'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 style={{ 
              color: '#00FF7F',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}>QuickBlog</h5>
            <p style={{ color: '#EAEAEA' }}>Your tech-savvy blogging platform</p>
          </div>
          <div className="col-md-6 text-end">
            <p style={{ 
              color: '#EAEAEA',
              fontFamily: 'monospace'
            }}>© 2024 QuickBlog. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer