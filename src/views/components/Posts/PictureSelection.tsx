const RightBox = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid #635bff',
            borderRadius: '0.5rem',
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            height: '100%' // Ensure it takes up the full height of the parent
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search for a song"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ccc',
                  backgroundColor: '#333',
                  color: 'white'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              backgroundColor: '#1a1a1a',
              border: '2px dashed gray',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h2 style={{ color: 'white' }}>DESIGN YOUR EVENT PAGE</h2>
              <button style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: 'gray',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}>
                Upload poster*
              </button>
            </div>
          </div>
    );
  };
  
  export default RightBox;
  