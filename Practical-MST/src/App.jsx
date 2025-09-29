import { useState } from 'react'
import './App.css'

function App() {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Suryansh', designation: 'Software Engineer' },
    { id: 2, name: 'Akshay', designation: 'Product Manager' },
    { id: 3, name: 'Priyanshu', designation: 'UI/UX Designer' },
  ])

  const handleDelete = (employeeId) => {
    setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== employeeId))
  }

  return (
    <>
      <h1>Employees</h1>

      {employees.length === 0 ? (
        <p className="read-the-docs">No employees to display.</p>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Designation</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>{emp.id}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>{emp.name}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>{emp.designation}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>
                    <button onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default App
