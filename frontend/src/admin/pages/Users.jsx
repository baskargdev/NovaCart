import { useEffect, useState } from "react";

import { FiSearch, FiTrash2, FiUser } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

const USERS_PER_PAGE = 12;

const Users = () => {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [deletingUser, setDeletingUser] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [totalUsers, setTotalUsers] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(
        `/admin/users?page=${currentPage}&limit=${USERS_PER_PAGE}&search=${encodeURIComponent(
          search.trim(),
        )}`,
      );

      if (data.success) {
        setUsers(data.users || []);

        setTotalUsers(data.totalUsers || 0);

        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever page or search changes
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delay);
  }, [currentPage, search]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Delete User
  const handleDelete = async (id, role) => {
    // Prevent deleting admin
    if (role === "admin") {
      toast.warning("Admin users cannot be deleted.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingUser(id);

      const { data } = await axiosInstance.delete(`/admin/users/${id}`);

      if (data.success) {
        toast.success(data.message);

        // Remove from current page immediately
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

        setTotalUsers((prevTotal) => Math.max(prevTotal - 1, 0));

        // If current page becomes empty, go to previous page
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          // Refresh current page so another user can fill the empty slot
          fetchUsers();
        }
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingUser(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#6D4AFF] rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">Loading Users...</p>
        </div>
      </div>
    );
  }

  // Calculate visible range
  const startUser =
    totalUsers === 0 ? 0 : (currentPage - 1) * USERS_PER_PAGE + 1;

  const endUser = Math.min(currentPage * USERS_PER_PAGE, totalUsers);

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111936]">Users</h1>

        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Manage registered users
        </p>
      </div>

      {/* ================= SEARCH + COUNT ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <FiSearch
              size={19}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-11
                pl-11
                pr-4
                rounded-xl
                border border-gray-200
                bg-gray-50
                outline-none
                text-gray-700
                placeholder:text-gray-400
                focus:bg-white
                focus:border-[#6D4AFF]
                focus:ring-2
                focus:ring-purple-100
                transition
              "
            />
          </div>

          {/* User Count */}
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{totalUsers}</span>{" "}
            {totalUsers === 1 ? "User" : "Users"}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-[#F8F9FC] border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <FiUser size={25} />
                        </div>

                        <p className="mt-4 font-semibold text-gray-700">
                          {search
                            ? "No users found"
                            : "No users registered yet"}
                        </p>

                        {search && (
                          <p className="text-sm text-gray-400 mt-1">
                            Try searching with a different name or email.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="
                        border-b
                        border-gray-100
                        last:border-b-0
                        hover:bg-[#FAFAFD]
                        transition
                      "
                    >
                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-11 h-11
                              shrink-0
                              rounded-full
                              bg-purple-100
                              text-[#6D4AFF]
                              flex
                              items-center
                              justify-center
                              font-semibold
                            "
                          >
                            <FiUser size={20} />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {user.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              User ID: {user._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-5">
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <span
                          className={`
                            inline-flex
                            items-center
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }
                          `}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-5">
                        <p className="text-sm text-gray-600">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            bg-green-100
                            text-green-700
                          "
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Active
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        {user.role === "admin" ? (
                          <span className="text-xs text-gray-400">
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDelete(user._id, user.role)}
                            disabled={deletingUser === user._id}
                            className="
                              inline-flex
                              items-center
                              justify-center
                              w-9
                              h-9
                              rounded-lg
                              text-red-500
                              hover:bg-red-50
                              hover:text-red-600
                              disabled:opacity-50
                              disabled:cursor-not-allowed
                              transition
                              cursor-pointer
                            "
                            title="Delete user"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm py-16 px-5 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
              <FiUser size={25} />
            </div>

            <p className="mt-4 font-semibold text-gray-700">
              {search ? "No users found" : "No users registered yet"}
            </p>

            {search && (
              <p className="text-sm text-gray-400 mt-1">
                Try a different search.
              </p>
            )}
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                shadow-sm
                p-5
              "
            >
              {/* User Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="
                      w-11
                      h-11
                      shrink-0
                      rounded-full
                      bg-purple-100
                      text-[#6D4AFF]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FiUser size={20} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-800 truncate">
                      {user.name}
                    </h2>

                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <span
                  className={`
                    shrink-0
                    px-3
                    py-1.5
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  `}
                >
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
              </div>

              {/* Details */}
              <div className="border-t border-gray-100 mt-5 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Joined
                  </p>

                  <p className="font-medium text-gray-700 mt-1">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Status
                  </p>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      mt-1
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      bg-green-100
                      text-green-700
                    "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                </div>
              </div>

              {/* Delete */}
              {user.role !== "admin" ? (
                <div className="border-t border-gray-100 mt-5 pt-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(user._id, user.role)}
                    disabled={deletingUser === user._id}
                    className="
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-2
                      border
                      border-red-200
                      text-red-500
                      hover:bg-red-500
                      hover:text-white
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      py-2.5
                      rounded-xl
                      font-medium
                      transition
                      cursor-pointer
                    "
                  >
                    <FiTrash2 size={17} />

                    {deletingUser === user._id ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 mt-5 pt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Admin account is protected
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ================= FOOTER COUNT + PAGINATION ================= */}
      {totalUsers > 0 && (
        <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Count */}
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">{startUser}</span> to{" "}
            <span className="font-semibold text-gray-700">{endUser}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalUsers}</span>{" "}
            users
          </p>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {/* Previous */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="
                  px-3
                  py-2
                  rounded-lg
                  border
                  border-gray-200
                  text-sm
                  font-medium
                  text-gray-600
                  hover:border-[#6D4AFF]
                  hover:text-[#6D4AFF]
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition
                  cursor-pointer
                "
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-9
                      h-9
                      rounded-lg
                      text-sm
                      font-medium
                      transition
                      cursor-pointer
                      ${
                        currentPage === page
                          ? "bg-[#6D4AFF] text-white"
                          : "text-gray-600 hover:bg-purple-50 hover:text-[#6D4AFF]"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  border
                  border-gray-200
                  text-sm
                  font-medium
                  text-gray-600
                  hover:border-[#6D4AFF]
                  hover:text-[#6D4AFF]
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition
                  cursor-pointer
                "
              >
                Next
              </button>
            </div>
          )}

          {/* Clear Search */}
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-sm text-[#6D4AFF] hover:text-[#5936F7] font-medium cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
