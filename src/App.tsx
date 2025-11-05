import { useState, useEffect } from 'react';
import { useStudyData } from './hooks/useStudyData';
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './components/Dashboard';
import { SubjectsTab } from './components/SubjectsTab';
import { AttendanceTab } from './components/AttendanceTab';
import { GradesTab } from './components/GradesTab';
import { ExamsTab } from './components/ExamsTab';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { SignUpFlow } from './components/SignUpFlow';
import { ECGAnimation } from './components/ECGAnimation';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const {
    subjects,
    schedule,
    semesterGrades,
    currentSemester,
    addSubject,
    deleteSubject,
    updateSubject,
    addLecture,
    updateLectureStatus,
    deleteLecture,
    addPomodoroTime,
    addExam,
    updateExam,
    deleteExam,
    addAttendance,
    deleteAttendance,
    addScheduleEntry,
    deleteScheduleEntry,
    clearSchedule,
    addSemesterGrade,
    updateSemesterGrade,
    deleteSemesterGrade,
    updateCurrentSemester,
    resetData,
  } = useStudyData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDayTime, setIsDayTime] = useState(true);
  const [showECG, setShowECG] = useState(false);
  
  const { user, isAuthenticated, isLoading, signUp, login, logout } = useAuth();

  // Show sign-up flow for new users
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <SignUpFlow onComplete={signUp} />;
  }

  const handleLogin = (email: string, password: string) => {
    const success = login(email, password);
    if (success) {
      setShowECG(true);
      setTimeout(() => {
        setShowECG(false);
      }, 3000);
    }
    return success;
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsDayTime(hour >= 6 && hour < 18);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const backgroundImage = isDayTime
    ? 'https://images.unsplash.com/photo-1513153090511-22df4c6ad14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwbGFuZHNjYXBlJTIwc3Vuc2hpbmV8ZW58MXx8fHwxNzYyMzI4MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080'
    : 'https://images.unsplash.com/photo-1633066439796-c87a600a4785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBmaXJlJTIwbW9vbiUyMG5pZ2h0fGVufDF8fHx8MTc2MjMyODI1Nnww&ixlib=rb-4.1.0&q=80&w=1080';

  const handleECGComplete = () => {
    setShowECG(false);
  };

  // Show ECG animation after login
  if (showECG) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black">
        <ECGAnimation onComplete={handleECGComplete} />
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <ImageWithFallback
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-teal-900/60 to-cyan-900/70" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-teal-900/50 to-cyan-900/60" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Floating Animated Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-teal-400/60 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-indigo-400/60 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Sidebar */}
      <div className="animate-slideInLeft">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isDayTime={isDayTime}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content - Adjusted for collapsible sidebar */}
      <div className="ml-40 min-h-screen relative z-10 transition-all duration-300">
        <main className="max-w-7xl mx-auto px-8 py-8">
          <div className="animate-fadeIn">
            {activeTab === 'dashboard' && <Dashboard subjects={subjects} onResetData={resetData} />}
            
            {activeTab === 'subjects' && (
              <SubjectsTab
                subjects={subjects}
                onAddSubject={addSubject}
                onDeleteSubject={deleteSubject}
                onUpdateSubject={updateSubject}
                onAddLecture={addLecture}
                onUpdateLectureStatus={updateLectureStatus}
                onDeleteLecture={deleteLecture}
                onAddPomodoroTime={addPomodoroTime}
                onAddExam={addExam}
                onUpdateExam={updateExam}
                onDeleteExam={deleteExam}
              />
            )}

            {activeTab === 'exams' && <ExamsTab subjects={subjects} />}

            {activeTab === 'grades' && (
              <GradesTab
                semesterGrades={semesterGrades}
                currentSemester={currentSemester}
                onAddSemesterGrade={addSemesterGrade}
                onUpdateSemesterGrade={updateSemesterGrade}
                onDeleteSemesterGrade={deleteSemesterGrade}
                onUpdateCurrentSemester={updateCurrentSemester}
              />
            )}
            
            {activeTab === 'attendance' && (
              <AttendanceTab
                subjects={subjects}
                schedule={schedule}
                onAddAttendance={addAttendance}
                onDeleteAttendance={deleteAttendance}
                onAddScheduleEntry={addScheduleEntry}
                onDeleteScheduleEntry={deleteScheduleEntry}
                onClearSchedule={clearSchedule}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-teal-400/60 text-sm animate-pulse-glow tracking-wider">Precision. Excellence. Innovation. 🏥</p>
        </footer>
      </div>
    </div>
  );
}
