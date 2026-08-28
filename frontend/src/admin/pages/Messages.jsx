import { useEffect, useState } from "react";

import {
  FiMail,
  FiEye,
  FiCheck,
  FiTrash2,
  FiX,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { toast } from "react-toastify";

import axiosInstance from "../../api/axiosInstance";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // =============================
  // PAGINATION
  // =============================

  const MESSAGES_PER_PAGE = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch Messages
  const fetchMessages = async (page = 1, showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const { data } = await axiosInstance.get("/contact", {
        params: {
          page,
          limit: MESSAGES_PER_PAGE,
        },
      });

      if (data.success) {
        setMessages(data.messages || []);

        setTotalMessages(data.totalMessages || 0);
        setTotalPages(data.totalPages || 0);
        setCurrentPage(data.page || page);
      } else {
        setMessages([]);
        setTotalMessages(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);

      toast.error(error.response?.data?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1);
  }, []);

  // Mark Message as Read
  const handleMarkAsRead = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/contact/${id}/read`);

      if (data.success) {
        toast.success("Message marked as read.");

        setMessages((prev) =>
          prev.map((message) =>
            message._id === id ? { ...message, status: "read" } : message,
          ),
        );

        setSelectedMessage((prev) =>
          prev && prev._id === id ? { ...prev, status: "read" } : prev,
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update message.");
    }
  };

  // Delete Message
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) return;

    try {
      const { data } = await axiosInstance.delete(`/contact/${id}`);

      if (data.success) {
        toast.success("Message deleted successfully.");

        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }

        /*
         * Check the current page after deletion.
         * If the page becomes empty, move to previous page.
         */
        const { data: refreshedData } = await axiosInstance.get("/contact", {
          params: {
            page: currentPage,
            limit: MESSAGES_PER_PAGE,
          },
        });

        const refreshedMessages = refreshedData.messages || [];

        const refreshedTotalMessages = refreshedData.totalMessages || 0;

        const refreshedTotalPages = refreshedData.totalPages || 0;

        // Current page still has messages
        if (
          refreshedMessages.length > 0 ||
          currentPage === 1 ||
          refreshedTotalPages === 0
        ) {
          setMessages(refreshedMessages);
          setTotalMessages(refreshedTotalMessages);
          setTotalPages(refreshedTotalPages);

          if (refreshedTotalPages === 0) {
            setCurrentPage(1);
          } else {
            setCurrentPage(Math.min(currentPage, refreshedTotalPages));
          }

          return;
        }

        // Current page became empty.
        // Move to previous page.
        const previousPage = Math.max(currentPage - 1, 1);

        await fetchMessages(previousPage, false);
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to delete message.");
    }
  };

  // View Message
  const handleViewMessage = async (message) => {
    setSelectedMessage(message);

    if (message.status === "new") {
      await handleMarkAsRead(message._id);
    }
  };

  // New Messages
  const newMessagesCount = messages.filter(
    (message) => message.status === "new",
  ).length;

  // =============================
  // PAGINATION HANDLERS
  // =============================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    fetchMessages(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Generate Page Numbers
  const getPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Showing Range
  const startMessage =
    totalMessages === 0 ? 0 : (currentPage - 1) * MESSAGES_PER_PAGE + 1;

  const endMessage =
    totalMessages === 0
      ? 0
      : Math.min(currentPage * MESSAGES_PER_PAGE, totalMessages);

  // Format Date
  const formatDate = (date) => {
    if (!date) {
      return {
        date: "Invalid Date",
        time: "--:--",
      };
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return {
        date: "Invalid Date",
        time: "--:--",
      };
    }

    return {
      date: parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),

      time: parsedDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6D4AFF] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">Loading Messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111936]">Messages</h1>

          <p className="text-gray-500 mt-1">
            Manage customer messages and enquiries.
          </p>
        </div>

        {/* Message Counts */}
        <div className="flex items-center gap-3">
          {/* Total Messages */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
            <FiMail className="text-[#6D4AFF]" size={18} />

            <span className="text-sm font-medium text-gray-600">
              Total: {totalMessages}
            </span>
          </div>

          {/* New Messages */}
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6D4AFF]" />

            <span className="text-sm font-medium text-[#6D4AFF]">
              New: {newMessagesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto">
              <FiMail size={28} className="text-[#6D4AFF]" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-5">
              No Messages
            </h2>

            <p className="text-gray-500 mt-2">
              Customer messages will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table Header */}
          <div
            className="
              hidden
              md:grid
              grid-cols-[1.35fr_1.35fr_2fr_1fr_0.9fr_100px]
              gap-4
              mx-3
              mt-3
              px-3
              py-3
              rounded-lg
              bg-[#F8F7FF]
              text-[11px]
              font-bold
              text-[#4B5280]
              uppercase
            "
          >
            <span>Customer</span>
            <span>Subject</span>
            <span>Message</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-center">Action</span>
          </div>

          {/* Message List */}
          <div className="px-3">
            {messages.map((message) => {
              const { date, time } = formatDate(message.createdAt);

              return (
                <div
                  key={message._id}
                  className={`
                    border-b
                    border-gray-100
                    last:border-b-0
                    transition
                    hover:bg-[#FCFBFF]
                    ${message.status === "new" ? "bg-purple-50/20" : "bg-white"}
                  `}
                >
                  {/* ================= DESKTOP ================= */}

                  <div
                    className="
                      hidden
                      md:grid
                      grid-cols-[1.35fr_1.35fr_2fr_1fr_0.9fr_100px]
                      gap-4
                      items-center
                      px-3
                      py-4
                    "
                  >
                    {/* Customer */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`
                          w-10
                          h-10
                          shrink-0
                          rounded-full
                          flex
                          items-center
                          justify-center
                          ${
                            message.status === "new"
                              ? "bg-purple-100 text-[#6D4AFF]"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        <FiUser size={18} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`
                            text-sm
                            truncate
                            ${
                              message.status === "new"
                                ? "font-bold text-[#111936]"
                                : "font-semibold text-[#111936]"
                            }
                          `}
                        >
                          {message.name}
                        </p>

                        <p className="text-[11px] text-gray-500 truncate mt-1">
                          {message.email}
                        </p>
                      </div>
                    </div>

                    {/* Subject */}
                    <p
                      className={`
                        text-xs
                        truncate
                        ${
                          message.status === "new"
                            ? "font-bold text-[#111936]"
                            : "font-semibold text-[#111936]"
                        }
                      `}
                    >
                      {message.subject}
                    </p>

                    {/* Message */}
                    <p className="text-xs text-gray-600 truncate">
                      {message.message}
                    </p>

                    {/* Date */}
                    <div className="text-xs text-[#4B5280]">
                      <p>{date}</p>

                      <p className="mt-1 text-[11px] text-gray-400">{time}</p>
                    </div>

                    {/* Status */}
                    <div>
                      {message.status === "new" ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-600 px-3 py-1.5 rounded-full text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-purple-100 text-[#6D4AFF] px-3 py-1.5 rounded-full text-[11px] font-semibold">
                          <FiCheck size={12} />
                          Read
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-2">
                      {/* View */}
                      <button
                        onClick={() => handleViewMessage(message)}
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-purple-200
                          bg-white
                          text-[#6D4AFF]
                          flex
                          items-center
                          justify-center
                          hover:bg-[#6D4AFF]
                          hover:text-white
                          transition
                          cursor-pointer
                        "
                        title="View Message"
                      >
                        <FiEye size={17} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-red-200
                          bg-white
                          text-red-500
                          flex
                          items-center
                          justify-center
                          hover:bg-red-500
                          hover:text-white
                          transition
                          cursor-pointer
                        "
                        title="Delete Message"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </div>

                  {/* ================= MOBILE ================= */}

                  <div className="md:hidden p-4">
                    {/* Customer + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`
                            w-11
                            h-11
                            shrink-0
                            rounded-full
                            flex
                            items-center
                            justify-center
                            ${
                              message.status === "new"
                                ? "bg-purple-100 text-[#6D4AFF]"
                                : "bg-gray-100 text-gray-500"
                            }
                          `}
                        >
                          <FiUser size={20} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[#111936] truncate">
                            {message.name}
                          </h3>

                          <p className="text-xs text-gray-500 truncate mt-1">
                            {message.email}
                          </p>
                        </div>
                      </div>

                      {message.status === "new" ? (
                        <span className="shrink-0 bg-green-100 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                          Unread
                        </span>
                      ) : (
                        <span className="shrink-0 bg-purple-100 text-[#6D4AFF] px-2.5 py-1 rounded-full text-[10px] font-semibold">
                          Read
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <h4 className="font-bold text-sm text-[#111936] mt-4">
                      {message.subject}
                    </h4>

                    {/* Message */}
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-5">
                      {message.message}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-gray-400">
                      <span>{date}</span>

                      <span>•</span>

                      <span>{time}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      {/* View */}
                      <button
                        onClick={() => handleViewMessage(message)}
                        className="
                          flex-1
                          flex
                          items-center
                          justify-center
                          gap-2
                          bg-purple-50
                          text-[#6D4AFF]
                          hover:bg-[#6D4AFF]
                          hover:text-white
                          px-3
                          py-2.5
                          rounded-lg
                          text-xs
                          font-semibold
                          transition
                          cursor-pointer
                        "
                      >
                        <FiEye size={15} />
                        View
                      </button>

                      {/* Mark as Read */}
                      {message.status === "new" && (
                        <button
                          onClick={() => handleMarkAsRead(message._id)}
                          className="
                            w-10
                            h-10
                            flex
                            items-center
                            justify-center
                            bg-green-50
                            text-green-600
                            hover:bg-green-600
                            hover:text-white
                            rounded-lg
                            transition
                            cursor-pointer
                          "
                          title="Mark as Read"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="
                          w-10
                          h-10
                          flex
                          items-center
                          justify-center
                          bg-red-50
                          text-red-500
                          hover:bg-red-500
                          hover:text-white
                          rounded-lg
                          transition
                          cursor-pointer
                        "
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination + Message Count */}
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Message Count */}
            <p className="text-sm text-[#4B5280] font-medium">
              Showing{" "}
              <span className="font-semibold text-[#111936]">
                {startMessage}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#111936]">{endMessage}</span>{" "}
              of{" "}
              <span className="font-semibold text-[#111936]">
                {totalMessages}
              </span>{" "}
              {totalMessages === 1 ? "message" : "messages"}
            </p>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-gray-200
                    text-gray-600
                    hover:bg-[#F7F5FF]
                    hover:text-[#6D4AFF]
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                  "
                  aria-label="Previous page"
                >
                  <FiChevronLeft size={17} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`
                      w-9
                      h-9
                      rounded-lg
                      text-sm
                      font-medium
                      transition
                      ${
                        currentPage === page
                          ? "bg-[#6D4AFF] text-white shadow-sm"
                          : "border border-gray-200 text-gray-600 hover:bg-[#F7F5FF] hover:text-[#6D4AFF]"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-gray-200
                    text-gray-600
                    hover:bg-[#F7F5FF]
                    hover:text-[#6D4AFF]
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                  "
                  aria-label="Next page"
                >
                  <FiChevronRight size={17} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MESSAGE MODAL ================= */}

      {selectedMessage && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="
              bg-white
              w-full
              max-w-2xl
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-[#111936]">
                  Message Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">Customer enquiry</p>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-gray-100
                  text-gray-500
                  hover:bg-gray-200
                  flex
                  items-center
                  justify-center
                  transition
                  cursor-pointer
                "
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Name
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {selectedMessage.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Email
                  </p>

                  <p className="mt-1 font-medium text-gray-800 break-all">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Subject
                </p>

                <p className="mt-1 font-medium text-gray-800">
                  {selectedMessage.subject}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Message
                </p>

                <div className="mt-2 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Received
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-[#6D4AFF]
                  hover:bg-[#5936F7]
                  text-white
                  font-semibold
                  transition
                  cursor-pointer
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
