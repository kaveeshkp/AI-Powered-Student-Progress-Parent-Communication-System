import DashboardLayout from "../../layouts/DashboardLayout";
import { PATHS } from "../../routes/paths";

export function StudentSchedulePage() {
  // Mock data - replace with API call
  const schedule = [
    {
      day: "Monday",
      classes: [
        { time: "09:00 - 10:30", subject: "Mathematics", teacher: "Dr. Jennifer Smith", room: "101" },
        { time: "10:45 - 12:15", subject: "English", teacher: "Mr. Robert Johnson", room: "205" },
        { time: "13:00 - 14:30", subject: "Science", teacher: "Dr. Emily Brown", room: "301" },
      ],
    },
    {
      day: "Tuesday",
      classes: [
        { time: "09:00 - 10:30", subject: "History", teacher: "Ms. Sarah Davis", room: "102" },
        { time: "10:45 - 12:15", subject: "Mathematics", teacher: "Dr. Jennifer Smith", room: "101" },
        { time: "13:00 - 14:30", subject: "PE", teacher: "Coach Mike Wilson", room: "Gym" },
      ],
    },
    {
      day: "Wednesday",
      classes: [
        { time: "09:00 - 10:30", subject: "Science", teacher: "Dr. Emily Brown", room: "301" },
        { time: "10:45 - 12:15", subject: "Art", teacher: "Ms. Linda Garcia", room: "Arts Studio" },
        { time: "13:00 - 14:30", subject: "Computer Science", teacher: "Mr. David Lee", room: "Lab 1" },
      ],
    },
    {
      day: "Thursday",
      classes: [
        { time: "09:00 - 10:30", subject: "English", teacher: "Mr. Robert Johnson", room: "205" },
        { time: "10:45 - 12:15", subject: "Mathematics", teacher: "Dr. Jennifer Smith", room: "101" },
        { time: "13:00 - 14:30", subject: "Music", teacher: "Ms. Jessica Martinez", room: "Music Room" },
      ],
    },
    {
      day: "Friday",
      classes: [
        { time: "09:00 - 10:30", subject: "Science Lab", teacher: "Dr. Emily Brown", room: "Lab 2" },
        { time: "10:45 - 12:15", subject: "History", teacher: "Ms. Sarah Davis", room: "102" },
        { time: "13:00 - 14:30", subject: "Assembly/Free Period", teacher: "", room: "Auditorium" },
      ],
    },
  ];

  const studentLinks = [
    { to: PATHS.STUDENT, label: "Overview", icon: "⊞", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_ASSIGNMENTS, label: "Assignments", icon: "📋", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_GRADES, label: "Grades", icon: "📊", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_SCHEDULE, label: "Schedule", icon: "🗓️", roles: ["STUDENT"] },
    { to: PATHS.MESSAGES, label: "Messages", icon: "💬", roles: ["STUDENT"] },
  ];

  return (
    <DashboardLayout links={studentLinks} title="My Schedule">
      <div className="space-y-6">
        {schedule.map((daySchedule) => (
          <div key={daySchedule.day} className="space-y-3">
            <h2 className="text-xl font-semibold text-white">{daySchedule.day}</h2>
            {daySchedule.classes.length > 0 ? (
              <div className="space-y-2">
                {daySchedule.classes.map((cls, idx) => (
                  <div key={idx} className="flex gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                    <div className="min-w-fit">
                      <p className="text-sm font-semibold text-indigo-300">{cls.time}</p>
                    </div>
                    <div className="flex-1 border-l border-slate-700 pl-4">
                      <h3 className="font-semibold text-white">{cls.subject}</h3>
                      {cls.teacher && <p className="text-sm text-slate-400">Instructor: {cls.teacher}</p>}
                      <p className="text-sm text-slate-500">Room: {cls.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No classes scheduled</p>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
