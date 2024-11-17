import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import { Box, Button, Tooltip} from "@mui/material";
import dayjs from "dayjs";
import data from "../data/data.json";
import { blue } from "@mui/material/colors";

// Helper function to convert data
const parseTimelineData = (data) => {
  const groups = [
    ...data.layers.map((layer) => {
      let title;

      if (layer.number === 3) {
        title = "OverrideLayer";
      } else if (layer.number === 4) {
        title = "finalSchedule";
      } else {
        title = `Layer ${layer.number}`; 
      }

      return {
        id: layer.number,
        title,
      };
    }),
    // Add OverrideLayer and finalSchedule manually to groups
    { id: 99, title: "OverrideLayer" },
    { id: 100, title: "finalSchedule" }
  ];

  const items = [
    ...data.layers.flatMap((layer) =>
      layer.layers.map((entry, index) => ({
        id: `${layer.number}-${index}`,
        group: layer.number,
        title: `User ${entry.userId}`,
        start_time: dayjs(entry.startDate).toDate(),
        end_time: dayjs(entry.endDate).toDate(),
        userId: entry.userId,
      }))
    ),
    // Example items for overrideLayer and finalSchedule
  ];

  return { groups, items };
};

// Generate unique color for each user
const TimelineChart = () => {
  const { groups, items } = parseTimelineData(data);
  const [currentView, setCurrentView] = useState("month");
  const [visibleTimeStart, setVisibleTimeStart] = useState(dayjs().startOf("month").valueOf());
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(dayjs().endOf("month").valueOf());
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // month is 0-based

  const getUserColor = (userId) => {
    const hue = (userId * 137) % 360; // Fixed color logic based on userId
    return `hsl(${hue}, 70%, 70%)`;
  };

  // Function to update view range based on selected year, month, and view type
  const updateViewRange = (view) => {
    const startOfMonth = dayjs().year(selectedYear).month(selectedMonth - 1).startOf("month");
    const endOfMonth = startOfMonth.endOf("month");

    switch (view) {
      case "month":
        setVisibleTimeStart(startOfMonth.valueOf());
        setVisibleTimeEnd(endOfMonth.valueOf());
        break;
      case "2-weeks":
        const twoWeekStart = startOfMonth.add(1, "week").startOf("week");
        const twoWeekEnd = twoWeekStart.add(2, "weeks").endOf("week");
        setVisibleTimeStart(twoWeekStart.valueOf());
        setVisibleTimeEnd(twoWeekEnd.valueOf());
        break;
      case "week":
        const weekStart = startOfMonth.startOf("week");
        const weekEnd = weekStart.add(1, "week").endOf("week");
        setVisibleTimeStart(weekStart.valueOf());
        setVisibleTimeEnd(weekEnd.valueOf());
        break;
      case "2-days":
        const twoDayStart = startOfMonth.startOf("day");
        const twoDayEnd = twoDayStart.add(2, "days").endOf("day");
        setVisibleTimeStart(twoDayStart.valueOf());
        setVisibleTimeEnd(twoDayEnd.valueOf());
        break;
      case "day":
        const dayStart = startOfMonth.startOf("day");
        const dayEnd = dayStart.endOf("day");
        setVisibleTimeStart(dayStart.valueOf());
        setVisibleTimeEnd(dayEnd.valueOf());
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    updateViewRange(currentView); // Ensure the time range updates when the view is changed
  }, [currentView, selectedYear, selectedMonth]);


  const handleTodayButton = () => {
    const today = dayjs();
    setSelectedYear(today.year());
    setSelectedMonth(today.month() + 1); // month is 0-based in dayjs

    // Set the visible time range for the current day
    const dayStart = today.startOf("day");
    const dayEnd = today.endOf("day");

    setVisibleTimeStart(dayStart.valueOf());
    setVisibleTimeEnd(dayEnd.valueOf());

    // Update the view to "day" if it's not already
    setCurrentView("day");
  };

  const handlePreviousButton = () => {
    const newStart = dayjs(visibleTimeStart).subtract(1, currentView === "month" ? "month" : "week").startOf(currentView === "month" ? "month" : "week");
    const newEnd = newStart.add(currentView === "month" ? 1 : 4, currentView === "month" ? "month" : "week");

    setVisibleTimeStart(newStart.valueOf());
    setVisibleTimeEnd(newEnd.valueOf());
  };

  const handleNextButton = () => {
    const newStart = dayjs(visibleTimeStart).add(1, currentView === "month" ? "month" : "week").startOf(currentView === "month" ? "month" : "week");
    const newEnd = newStart.add(currentView === "month" ? 1 : 4, currentView === "month" ? "month" : "week");

    setVisibleTimeStart(newStart.valueOf());
    setVisibleTimeEnd(newEnd.valueOf());
  };

  return (
      <Box>
          <h1 className="heading" style={{display:"flex", justifyContent:"center"}}>Timeline-Chart</h1>
          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
          <Button onClick={handlePreviousButton}>Previous</Button>
          <Button onClick={handleTodayButton}>Today</Button>
          <Button onClick={handleNextButton}>Next</Button>
        </Box>

      {/* View Toggle and other UI components */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => setCurrentView("month")} sx={{ backgroundColor: blue, color: "#black", '&:hover': { backgroundColor: "#66bb6a" } }}>Month</Button>
        <Button onClick={() => setCurrentView("2-weeks")} sx={{ backgroundColor: blue, color: "#black", '&:hover': { backgroundColor: "#66bb6a" } }}>2-Weeks</Button>
        <Button onClick={() => setCurrentView("week")} sx={{ backgroundColor: blue, color: "#black", '&:hover': { backgroundColor: "#66bb6a" } }}>Week</Button>
        <Button onClick={() => setCurrentView("2-days")} sx={{ backgroundColor: blue, color: "#black", '&:hover': { backgroundColor: "#66bb6a" } }}>2-Days</Button>
        <Button onClick={() => setCurrentView("day")} sx={{ backgroundColor: blue, color: "#black", '&:hover': { backgroundColor: "#66bb6a" } }}>Day</Button>
      </Box>

      <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
        <Timeline
          groups={groups}
          items={items.map((item) => ({
            ...item,
            itemProps: {
              style: {
                backgroundColor: getUserColor(item.userId),
                borderRadius: "5px",
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                height: 50,
                width: 120,
              },
              children: (
                <Tooltip title={`User ID: ${item.userId}`} arrow>
                  <div>{item.title}</div>
                </Tooltip>
              ),
            },
          }))}
          visibleTimeStart={visibleTimeStart}
          visibleTimeEnd={visibleTimeEnd}
          onTimeChange={(start, end) => {
            setVisibleTimeStart(start);
            setVisibleTimeEnd(end);
          }}
        />
      </Box>
    </Box>
  );
};

export default TimelineChart;
