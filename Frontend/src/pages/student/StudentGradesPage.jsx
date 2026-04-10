import DashboardLayout from "../../layouts/DashboardLayout";
import { PATHS } from "../../routes/paths";

export function StudentGradesPage() {
  // Mock data - replace with API call
  const grades = [
    {
      id: 1,
      subject: "Mathematics",
      teacher: "Dr. Jennifer Smith",
      assignments: [
        { name: "Quiz 1", grade: "A", weight: 20 },
        { name: "Midterm", grade: "B+", weight: 40 },
        { name: "Final Project", grade: "A-", weight: 40 },
      ],
      overall: "A-",
      percentage: 88,
    },
    {
      id: 2,
      subject: "English",
      teacher: "Mr. Robert Johnson",
      assignments: [
        { name: "Essay 1", grade: "A", weight: 30 },
        { name: "Essay 2", grade: "A", weight: 30 },
        { name: "Presentation", grade: "B+", weight: 40 },
      ],
      overall: "A",
      percentage: 92,
    },
    {
      id: 3,
      subject: "Science",
      teacher: "Dr. Emily Brown",
      assignments: [
        { name: "Lab Report", grade: "B", weight: 25 },
        { name: "Exam", grade: "B+", weight: 50 },
        { name: "Project", grade: "A", weight: 25 },
      ],
      overall: "B+",
      percentage: 85,
    },
  ];

  const studentLinks = [
    { to: PATHS.STUDENT, label: "Overview", icon: "⊞", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_ASSIGNMENTS, label: "Assignments", icon: "📋", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_GRADES, label: "Grades", icon: "📊", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_SCHEDULE, label: "Schedule", icon: "🗓️", roles: ["STUDENT"] },
    { to: PATHS.MESSAGES, label: "Messages", icon: "💬", roles: ["STUDENT"] },
  ];

  const getGradeColor = (grade) => {
    const letter = grade.charAt(0);
    switch (letter) {
      case "A":
        return "text-green-300";
      case "B":
        return "text-blue-300";
      case "C":
        return "text-yellow-300";
      case "D":
        return "text-orange-300";
      case "F":
        return "text-red-300";
      default:
        return "text-slate-300";
    }
  };

  const overallGPA = (grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1);

  return (
    <DashboardLayout links={studentLinks} title="My Grades">
      <div className="space-y-6">
        {/* Overall GPA */}
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-6">
          <p className="text-sm text-slate-300">Overall GPA</p>
          <p className="text-4xl font-bold text-indigo-300">{overallGPA}/100</p>
          <p className="mt-2 text-xs text-slate-400">Based on all subjects this term</p>
        </div>

        {/* Grades by Subject */}
        <div className="space-y-4">
          {grades.map((subject) => (
            <div key={subject.id} className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{subject.subject}</h3>
                  <p className="text-sm text-slate-400">Teacher: {subject.teacher}</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getGradeColor(subject.overall)}`}>{subject.overall}</p>
                  <p className="text-sm text-slate-400">{subject.percentage}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 space-y-2">
                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>

              {/* Grade Breakdown */}
              <div className="space-y-2 border-t border-slate-700 pt-4">
                {subject.assignments.map((assignment, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-slate-200">{assignment.name}</p>
                      <p className="text-xs text-slate-500">{assignment.weight}% weight</p>
                    </div>
                    <span className={`text-lg font-semibold ${getGradeColor(assignment.grade)}`}>
                      {assignment.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
