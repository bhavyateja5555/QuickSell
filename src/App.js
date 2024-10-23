import React, { useState, useEffect } from "react";
import './App.css';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState("status");
  const [sort, setSort] = useState("");
  const [displayOptions, setDisplayOptions] = useState(false);

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets);
        setUsers(data.users);
      });
  }, []);

  const getGroupedTickets = () => {
    let grouped = {};
    if (grouping === "status") {
      tickets.forEach(ticket => {
        if (!grouped[ticket.status]) grouped[ticket.status] = [];
        grouped[ticket.status].push(ticket);
      });
    } else if (grouping === "user") {
      tickets.forEach(ticket => {
        const userName = users.find(user => user.id === ticket.userId)?.name || "Unknown User";
        if (!grouped[userName]) grouped[userName] = [];
        grouped[userName].push(ticket);
      });
    } else if (grouping === "priority") {
      tickets.forEach(ticket => {
        const priorityLabel = getPriorityLabel(ticket.priority);
        if (!grouped[priorityLabel]) grouped[priorityLabel] = [];
        grouped[priorityLabel].push(ticket);
      });
    }

    if (sort === "priority") {
      for (const key in grouped) {
        grouped[key].sort((a, b) => b.priority - a.priority);
      }
    } else if (sort === "title") {
      for (const key in grouped) {
        grouped[key].sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return grouped;
  };

  
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 4: return "Urgent";
      case 3: return "High";
      case 2: return "Medium";
      case 1: return "Low";
      case 0: return "No priority";
      default: return "Unknown";
    }
  };

  const handleGroupingChange = (e) => setGrouping(e.target.value);
  const handleSortChange = (e) => setSort(e.target.value);

  const groupedTickets = getGroupedTickets();
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (displayOptions && !event.target.closest('.controls')) {
            setDisplayOptions(false);
        }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
        window.removeEventListener('click', handleClickOutside);
    };
  }, [displayOptions]);
  return (
    <div className="app">
      <div className="controls">
        <div>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 10.5C9.63261 10.5 9.75979 10.5527 9.85355 10.6464C9.94732 10.7402 10 10.8674 10 11V14C10 14.1326 9.94732 14.2598 9.85355 14.3536C9.75979 14.4473 9.63261 14.5 9.5 14.5H8.5C8.36739 14.5 8.24021 14.4473 8.14645 14.3536C8.05268 14.2598 8 14.1326 8 14V11C8 10.8674 8.05268 10.7402 8.14645 10.6464C8.24021 10.5527 8.36739 10.5 8.5 10.5H9.5ZM7 11.5V13H1.75C1.55109 13 1.36032 12.921 1.21967 12.7803C1.07902 12.6397 1 12.4489 1 12.25C1 12.0511 1.07902 11.8603 1.21967 11.7197C1.36032 11.579 1.55109 11.5 1.75 11.5H7ZM14.25 11.5C14.4489 11.5 14.6397 11.579 14.7803 11.7197C14.921 11.8603 15 12.0511 15 12.25C15 12.4489 14.921 12.6397 14.7803 12.7803C14.6397 12.921 14.4489 13 14.25 13H11V11.5H14.25ZM5.5 6C5.63261 6 5.75979 6.05268 5.85355 6.14645C5.94732 6.24021 6 6.36739 6 6.5V9.5C6 9.63261 5.94732 9.75979 5.85355 9.85355C5.75979 9.94732 5.63261 10 5.5 10H4.5C4.36739 10 4.24021 9.94732 4.14645 9.85355C4.05268 9.75979 4 9.63261 4 9.5V6.5C4 6.36739 4.05268 6.24021 4.14645 6.14645C4.24021 6.05268 4.36739 6 4.5 6H5.5ZM3 7.25V8.75H1.75C1.55109 8.75 1.36032 8.67098 1.21967 8.53033C1.07902 8.38968 1 8.19891 1 8C1 7.80109 1.07902 7.61032 1.21967 7.46967C1.36032 7.32902 1.55109 7.25 1.75 7.25H3ZM14.25 7.25C14.4489 7.25 14.6397 7.32902 14.7803 7.46967C14.921 7.61032 15 7.80109 15 8C15 8.19891 14.921 8.38968 14.7803 8.53033C14.6397 8.67098 14.4489 8.75 14.25 8.75H7V7.25H14.25ZM11.5 1.75C11.6326 1.75 11.7598 1.80268 11.8536 1.89645C11.9473 1.99021 12 2.11739 12 2.25V5.25C12 5.38261 11.9473 5.50979 11.8536 5.60355C11.7598 5.69732 11.6326 5.75 11.5 5.75H10.5C10.3674 5.75 10.2402 5.69732 10.1464 5.60355C10.0527 5.50979 10 5.38261 10 5.25V2.25C10 2.11739 10.0527 1.99021 10.1464 1.89645C10.2402 1.80268 10.3674 1.75 10.5 1.75H11.5ZM9 3V4.5H1.75C1.55109 4.5 1.36032 4.42098 1.21967 4.28033C1.07902 4.13968 1 3.94891 1 3.75C1 3.55109 1.07902 3.36032 1.21967 3.21967C1.36032 3.07902 1.55109 3 1.75 3H9ZM14.25 3C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75C15 3.94891 14.921 4.13968 14.7803 4.28033C14.6397 4.42098 14.4489 4.5 14.25 4.5H13V3H14.25Z" fill="#5C5C5E"/>
            </svg>
          </span>
          <label htmlFor="display" className="d1">Display:</label>
          <div className="display-dropdown" tabIndex="0" onClick={() => {
              setDisplayOptions((prev) => {
              const newValue = !prev;
              return newValue;
            });
          }}>
            <span>▼</span>
          </div>


            {displayOptions && (
              <div className="dropdown-menu">
                <div className="grouping">
                  <label htmlFor="grouping">Grouping:</label>
                  <select id="grouping" value={grouping} onChange={handleGroupingChange} onClick={(e) => e.stopPropagation()}>
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div className="ordering">
                  <label htmlFor="sort">Ordering:</label>
                  <select id="sort" value={sort} onChange={handleSortChange} onClick={(e) => e.stopPropagation()}>
                    <option value="">None</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

      <div className="kanban-board">
        {Object.keys(groupedTickets).map((group, idx) => (
          <div key={idx} className="kanban-column">
            <h2>
              {grouping === "status" && getStatusIcon(group)}
              {grouping === "priority" && getPriorityIcon(group)} 
              {group}  {groupedTickets[group].length}
              <span className="add">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.75 4C8.75 3.58579 8.41421 3.25 8 3.25C7.58579 3.25 7.25 3.58579 7.25 4V7.25H4C3.58579 7.25 3.25 7.58579 3.25 8C3.25 8.41421 3.58579 8.75 4 8.75H7.25V12C7.25 12.4142 7.58579 12.75 8 12.75C8.41421 12.75 8.75 12.4142 8.75 12V8.75H12C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25H8.75V4Z" fill="#5C5C5E"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 6.5C3.39782 6.5 3.77936 6.65804 4.06066 6.93934C4.34196 7.22064 4.5 7.60218 4.5 8C4.5 8.39782 4.34196 8.77936 4.06066 9.06066C3.77936 9.34196 3.39782 9.5 3 9.5C2.60218 9.5 2.22064 9.34196 1.93934 9.06066C1.65804 8.77936 1.5 8.39782 1.5 8C1.5 7.60218 1.65804 7.22064 1.93934 6.93934C2.22064 6.65804 2.60218 6.5 3 6.5ZM8 6.5C8.39782 6.5 8.77936 6.65804 9.06066 6.93934C9.34196 7.22064 9.5 7.60218 9.5 8C9.5 8.39782 9.34196 8.77936 9.06066 9.06066C8.77936 9.34196 8.39782 9.5 8 9.5C7.60218 9.5 7.22064 9.34196 6.93934 9.06066C6.65804 8.77936 6.5 8.39782 6.5 8C6.5 7.60218 6.65804 7.22064 6.93934 6.93934C7.22064 6.65804 7.60218 6.5 8 6.5ZM13 6.5C13.3978 6.5 13.7794 6.65804 14.0607 6.93934C14.342 7.22064 14.5 7.60218 14.5 8C14.5 8.39782 14.342 8.77936 14.0607 9.06066C13.7794 9.34196 13.3978 9.5 13 9.5C12.6022 9.5 12.2206 9.34196 11.9393 9.06066C11.658 8.77936 11.5 8.39782 11.5 8C11.5 7.60218 11.658 7.22064 11.9393 6.93934C12.2206 6.65804 12.6022 6.5 13 6.5Z" fill="#5C5C5E"/>
                </svg>
              </span>
            </h2>
            {groupedTickets[group].map(ticket => (
              <div key={ticket.id} className="kanban-ticket">
                <div className="ticket-header">
                  <span className="ticket-code">{ticket.id}</span>
                </div>
                <h3>{getStatusIcon(ticket.status)}<span>{ticket.title}</span></h3>
                <div className="ticket-footer">
                  <div className="feature-tag">
                    <div className="circle-box"></div>
                    <span>Feature Request</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case "Urgent":
    case 4: return <UrgentIcon />;
    case "High":
    case 3: return <HighIcon />;
    case "Medium":
    case 2: return <MediumIcon />;
    case "Low":
    case 1: return <LowIcon />;
    default: return <NoPriorityIcon />;
  }
};
const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "todo":
      return <ToDoIcon />;
    case "in progress":
      return <InProgressIcon />;
    default: return <BacklogIcon />;
  }
};


const UrgentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
    <path d="M3 1C1.91 1 1 1.91 1 3V13C1 14.09 1.91 15 3 15H13C14.09 15 15 14.09 15 13V3C15 1.91 14.09 1 13 1H3ZM7 4H9L8.75 9H7.25L7 4ZM9 11C9 11.55 8.55 12 8 12C7.45 12 7 11.55 7 11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11Z" fill="#FB773F" />
  </svg>
);

const HighIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
    <path d="M3.5 8H2.5C1.95 8 1.5 8.45 1.5 9V13C1.5 13.55 1.95 14 2.5 14H3.5C4.05 14 4.5 13.55 4.5 13V9C4.5 8.45 4.05 8 3.5 8Z" fill="#5C5C5E" />
    <path d="M8.5 5H7.5C6.95 5 6.5 5.45 6.5 6V13C6.5 13.55 6.95 14 7.5 14H8.5C9.05 14 9.5 13.55 9.5 13V6C9.5 5.45 9.05 5 8.5 5Z" fill="#5C5C5E" />
    <path d="M13.5 2H12.5C11.95 2 11.5 2.45 11.5 3V13C11.5 13.55 11.95 14 12.5 14H13.5C14.05 14 14.5 13.55 14.5 13V3C14.5 2.45 14.05 2 13.5 2Z" fill="#5C5C5E" />
  </svg>
);

const MediumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 8H2.5C1.94772 8 1.5 8.44772 1.5 9V13C1.5 13.5523 1.94772 14 2.5 14H3.5C4.05228 14 4.5 13.5523 4.5 13V9C4.5 8.44772 4.05228 8 3.5 8Z" fill="#5C5C5E"/>
    <path d="M8.5 5H7.5C6.94772 5 6.5 5.44772 6.5 6V13C6.5 13.5523 6.94772 14 7.5 14H8.5C9.05228 14 9.5 13.5523 9.5 13V6C9.5 5.44772 9.05228 5 8.5 5Z" fill="#5C5C5E"/>
    <path d="M13.5 2H12.5C11.9477 2 11.5 2.44772 11.5 3V13C11.5 13.5523 11.9477 14 12.5 14H13.5C14.0523 14 14.5 13.5523 14.5 13V3C14.5 2.44772 14.0523 2 13.5 2Z" fill="#5C5C5E" fill-opacity="0.4"/>
  </svg>
);

const LowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 8H2.5C1.94772 8 1.5 8.44772 1.5 9V13C1.5 13.5523 1.94772 14 2.5 14H3.5C4.05228 14 4.5 13.5523 4.5 13V9C4.5 8.44772 4.05228 8 3.5 8Z" fill="#5C5C5E"/>
    <path d="M8.5 5H7.5C6.94772 5 6.5 5.44772 6.5 6V13C6.5 13.5523 6.94772 14 7.5 14H8.5C9.05228 14 9.5 13.5523 9.5 13V6C9.5 5.44772 9.05228 5 8.5 5Z" fill="#5C5C5E" fill-opacity="0.4"/>
    <path d="M13.5 2H12.5C11.9477 2 11.5 2.44772 11.5 3V13C11.5 13.5523 11.9477 14 12.5 14H13.5C14.0523 14 14.5 13.5523 14.5 13V3C14.5 2.44772 14.0523 2 13.5 2Z" fill="#5C5C5E" fill-opacity="0.4"/>
  </svg>
);

const NoPriorityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path opacity="0.9" d="M4.5 7.34375H2.75C2.50838 7.34375 2.3125 7.53963 2.3125 7.78125V8.21875C2.3125 8.46037 2.50838 8.65625 2.75 8.65625H4.5C4.74162 8.65625 4.9375 8.46037 4.9375 8.21875V7.78125C4.9375 7.53963 4.74162 7.34375 4.5 7.34375Z" fill="#5E5E5F"/>
    <path opacity="0.9" d="M8.875 7.34375H7.125C6.88338 7.34375 6.6875 7.53963 6.6875 7.78125V8.21875C6.6875 8.46037 6.88338 8.65625 7.125 8.65625H8.875C9.11662 8.65625 9.3125 8.46037 9.3125 8.21875V7.78125C9.3125 7.53963 9.11662 7.34375 8.875 7.34375Z" fill="#5E5E5F"/>
    <path opacity="0.9" d="M13.25 7.34375H11.5C11.2584 7.34375 11.0625 7.53963 11.0625 7.78125V8.21875C11.0625 8.46037 11.2584 8.65625 11.5 8.65625H13.25C13.4916 8.65625 13.6875 8.46037 13.6875 8.21875V7.78125C13.6875 7.53963 13.4916 7.34375 13.25 7.34375Z" fill="#5E5E5F"/>
  </svg>
);

const ToDoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#B8B8B8" stroke-width="2"/>
  </svg>
);

const InProgressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" fill="white" stroke="#F2BE00" stroke-width="2"/>
    <path d="M9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9C8.10457 9 9 8.10457 9 7Z" stroke="#F2BE00" stroke-width="4"/>
  </svg>
);

const BacklogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#95999F" stroke-width="2" stroke-dasharray="1.4 1.74"/>
  </svg>
);



export default App;
