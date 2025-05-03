import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Input } from "./components/ui/input";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { SortableHeader } from "./components/utils/SortableHeader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef } from "react";
import data from "./data/data.json";

const statusColor = {
  ACTIVE: "text-green-600 bg-green-100",
  BLOCKED: "text-red-600 bg-red-100",
  INVITED: "text-blue-600 bg-blue-100",
};

const headerMap = {
  Name: "name",
  Email: "email",
  "Start Date": "startDate",
  "Invited by": "invitedBy",
  Status: "status",
};

const CustomDateInput = forwardRef(({ value, onClick, className }, ref) => (
  <div ref={ref}>
    <Button
      variant="outline"
      onClick={onClick}
      className={`border border-gray-300 rounded-md px-2 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center ${className}`}
    >
      <span className="truncate">{value || "Date"}</span>
      <span className="ml-1">📅</span>
    </Button>
  </div>
));
CustomDateInput.displayName = "CustomDateInput";

export default function UserDetails() {
  const [sortedBy, setSortedBy] = useState({ key: "", direction: "asc" });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userList, setUserList] = useState(data);

  const handleSort = useCallback((label) => {
    const key = headerMap[label];
    setSortedBy((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleStatusUpdate = useCallback((index, newStatus) => {
    setUserList((prevList) => {
      const updated = [...prevList];
      updated[index] = {
        ...updated[index],
        about: { ...updated[index].about, status: newStatus },
      };
      return updated;
    });
  }, []);


  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      const matchesStatus = selectedStatus
        ? user.about.status === selectedStatus
        : true;
      const matchesSearch = user.about.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStartDate = startDate
        ? new Date(user.details.date) >= new Date(startDate)
        : true;
      return matchesStatus && matchesSearch && matchesStartDate;
    });
  }, [userList, selectedStatus, searchTerm, startDate]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const key = sortedBy.key;
      if (!key) return 0;

      const getValue = (user) => {
        switch (key) {
          case "name":
          case "email":
          case "status":
            return user.about[key]?.toString().toLowerCase() ?? "";
          case "startDate":
            return user.details.date?.toString().toLowerCase() ?? "";
          case "invitedBy":
            return user.details.invitedBy?.toString().toLowerCase() ?? "";
          default:
            return "";
        }
      };

      const valA = getValue(a);
      const valB = getValue(b);

      return sortedBy.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [filteredUsers, sortedBy]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / itemsPerPage));
  
  
  const paginatedUsers = useMemo(() => {
    return sortedUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedUsers, currentPage, itemsPerPage]);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const clearFilters = useCallback(() => {
    setSelectedStatus("");
    setSearchTerm("");
    setStartDate("");
    setCurrentPage(1);
  }, []);

  
  const statistics = useMemo(() => {
    const inactiveCount = userList.filter(
      (user) => user.about.status === "INVITED"
    ).length;
    const blockedCount = userList.filter(
      (user) => user.about.status === "BLOCKED"
    ).length;
    const totalUserCount = userList.length;
    const activeCount = totalUserCount - inactiveCount - blockedCount;

    return {
      totalUserCount,
      activeCount,
      inactiveCount,
      blockedCount,
      inactivePercent: ((inactiveCount / totalUserCount) * 100).toFixed(0) + "%",
      blockedPercent: ((blockedCount / totalUserCount) * 100).toFixed(0) + "%",
    };
  }, [userList]);

  function statusText(status) {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "INVITED":
        return "Inactive";
      case "BLOCKED":
        return "Blocked";
      default:
        return "";
    }
  }

  return (
    <div className="p-2 md:p-4 lg:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-baseline flex-col">
          <h1 className="text-xl md:text-2xl font-semibold">User Details</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Information about users, including name, email, start date,
            inviter, status, and available actions.
          </p>
        </div>
        <Button className="h-10 self-start sm:self-auto">Download Report</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {[
          { label: "Total Users", count: statistics.totalUserCount, statusIcon: "🤴" },
          {
            label: "Active Users",
            count: statistics.activeCount,
            statusIcon: "🙋‍♂️",
          },
          {
            label: "Inactive Users",
            count: statistics.inactivePercent,
            statusIcon: "💆‍♂️",
          },
          {
            label: "Blocked Users",
            count: statistics.blockedPercent,
            statusIcon: "🙅‍♂️",
          },
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="flex items-center space-x-2 md:space-x-4 p-2 md:p-4">
              <div className="bg-green-100 p-1 md:p-2 rounded-full">
                <span className="text-base md:text-xl">{item.statusIcon}</span>
              </div>
              <div>
                <p className="text-gray-500 text-xs md:text-sm">{item.label}</p>
                <p className="text-base md:text-lg font-bold">{item.count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Input
          placeholder="🔍 Search by name"
          className="w-full max-w-xs bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => setSelectedStatus(value)}
            value={selectedStatus}
          >
            <SelectTrigger className="w-28 md:w-32 bg-white">
              <SelectValue
                placeholder="Status"
                selectedValue={statusText(selectedStatus)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
              <SelectItem value="INVITED">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <DatePicker
            portalId="date-picker-portal"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            customInput={
              <CustomDateInput className="w-24 md:w-30 bg-white flex justify-between" />
            }
          />

          <Button onClick={clearFilters} className="h-10">
            Clear
          </Button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Start Date", "Invited by", "Status"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-2 md:px-6 py-2 md:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    <SortableHeader
                      label={heading}
                      sortedBy={sortedBy}
                      onClick={handleSort}
                    />
                  </th>
                )
              )}
              <th className="px-2 md:px-6 py-2 md:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => (
                <tr key={index}>
                  <td className="px-2 md:px-6 py-2 md:py-4 font-medium text-black text-left truncate max-w-xs">
                    {user.about.name}
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4 text-black text-left truncate max-w-xs">
                    {user.about.email}
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4 text-black text-left whitespace-nowrap">
                    {user.details.date}
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4 text-black text-left truncate max-w-xs">
                    {user.details.invitedBy}
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColor[user.about.status]
                      }`}
                    >
                      {
                        {
                          ACTIVE: "Active",
                          BLOCKED: "Blocked",
                          INVITED: "Inactive",
                        }[user.about.status]
                      }
                    </span>
                  </td>

                  <td className="px-2 md:px-6 py-2 md:py-4 flex flex-wrap gap-1 ">
                    {["Active", "Blocked", "Inactive"].map((statusOption) => {
                      const statusValue =
                        statusOption.toUpperCase() === "INACTIVE"
                          ? "INVITED"
                          : statusOption.toUpperCase();

                      const isCurrent = user.about.status === statusValue;

                      return (
                        <Button
                          key={statusOption}
                          variant={
                            isCurrent
                              ? statusValue === "ACTIVE"
                                ? "active"
                                : statusValue === "INVITED"
                                ? "inactive"
                                : "blocked"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(
                              userList.indexOf(user),
                              statusValue
                            )
                          }
                          className="text-xs p-0"
                          title={statusOption}
                        >
                          {statusOption === "Active"
                            ? "✅"
                            : statusOption === "Inactive"
                            ? "🔵"
                            : "🚫"}
                        </Button>
                      );
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No users found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center pt-4">
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" onClick={() => goToPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
                          <span className="px-2 text-sm md:text-base">
              Page <strong>{currentPage}</strong> of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>    
  );
}