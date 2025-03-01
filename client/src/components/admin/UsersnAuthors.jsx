import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './AdminStyles.css';

const UsersnAuthors = () => {
  const [users, setUsers] = useState([]);
  const { getToken } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentuser"));
        const userId = currentUser ? currentUser._id : null;
    
        
        const response = await axios.get(`${BACKEND_URL}/user-api/users`, {
          headers: {
            Authorization: `Bearer ${userId}`,
          },
        });
        // console.log("meeeeeeee",response.data.payload)
        setUsers(response.data.payload);
      } catch (error) {
        console.error("Full error:", error);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, [getToken]);

  const toggleBlockStatus = async (id, blocked) => {
    try {
      const token = await getToken();
      const response = await axios.put(
        `${BACKEND_URL}/admin-api/admin/block-unblock/${id}`,
        { blocked: !blocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, blocked: response.data.payload.blocked } : user
        )
      );
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      toast.error("Failed to update user status");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-table-container p-4"
    >
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="p-3">NAME</th>
              <th className="p-3">ROLE</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="p-3">
                  <div className="text-white">{user.firstName} {user.lastName}</div>
                  <div className="user-email">{user.email}</div>
                </td>
                <td className="p-3">
                  <span className="status-badge status-badge-role">
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`status-badge ${user.blocked ? 'status-badge-blocked' : 'status-badge-active'}`}>
                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBlockStatus(user._id, user.blocked)}
                    className={`action-btn ${user.blocked ? 'action-btn-unblock' : 'action-btn-block'}`}
                  >
                    {user.blocked ? (
                      <>
                        <i className="bi bi-unlock"></i>
                        Unblock
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock"></i>
                        Block
                      </>
                    )}
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersnAuthors;