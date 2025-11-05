import { Subject } from '../types/study';
import { CheckCircle2, Circle } from 'lucide-react';

interface SubjectClassificationViewProps {
  subject: Subject;
}

export function SubjectClassificationView({ subject }: SubjectClassificationViewProps) {
  if (!subject.classification) return null;

  const { branches, chapters, anatomicalRegions, categories, clinical } = subject.classification;

  return (
    <div className="space-y-6">
      {/* Branches (FMIMC) */}
      {branches && (
        <div className="glass-card rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl text-white mb-4 gradient-text">Subject Branches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="rounded-xl p-4 border transition-all hover:scale-105 hover:shadow-xl"
                style={{ 
                  backgroundColor: `${branch.color}15`,
                  borderColor: `${branch.color}40`
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{branch.name}</h4>
                    <p className="text-xs text-white/50 mt-1">{branch.type}</p>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: branch.color }}
                  />
                </div>
                <div className="flex gap-3 mt-3 text-sm">
                  {branch.lectures !== undefined && (
                    <div className="text-white/70">
                      <span className="text-white font-medium">{branch.lectures}</span> lectures
                    </div>
                  )}
                  {branch.practicals !== undefined && (
                    <div className="text-white/70">
                      <span className="text-white font-medium">{branch.practicals}</span> practicals
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapters (OPTH) */}
      {chapters && (
        <div className="glass-card rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl text-white mb-4 gradient-text">Subject Chapters</h3>
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <div
                key={index}
                className="rounded-xl p-4 border transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ 
                  backgroundColor: `${chapter.color}15`,
                  borderColor: `${chapter.color}40`
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: chapter.color }}
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-2">{chapter.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {chapter.lectures.map((lecture, lectureIndex) => (
                        <span
                          key={lectureIndex}
                          className="px-2 py-1 text-xs rounded-lg bg-white/5 text-white/70 border border-white/10"
                        >
                          {lecture}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anatomical Regions (ENT) */}
      {anatomicalRegions && (
        <div className="glass-card rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl text-white mb-4 gradient-text">Anatomical Regions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {anatomicalRegions.map((region, index) => (
              <div
                key={index}
                className="rounded-xl p-5 border transition-all hover:scale-105 hover:shadow-xl"
                style={{ 
                  backgroundColor: `${region.color}15`,
                  borderColor: `${region.color}40`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-2xl text-white font-bold">{region.region}</h4>
                    <p className="text-xs text-white/50 mt-1">{region.type}</p>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: region.color }}
                  />
                </div>
                <div className="mb-3">
                  <span className="text-sm text-white/70">
                    <span className="text-white font-medium text-lg">{region.lectures}</span> lectures
                  </span>
                </div>
                <div className="space-y-1">
                  {region.topics.slice(0, 3).map((topic, topicIndex) => (
                    <p key={topicIndex} className="text-xs text-white/60 line-clamp-1">
                      • {topic}
                    </p>
                  ))}
                  {region.topics.length > 3 && (
                    <p className="text-xs text-white/50 italic">
                      +{region.topics.length - 3} more topics
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories (EBM) */}
      {categories && (
        <div className="glass-card rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl text-white mb-4 gradient-text">Research Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <div
                key={index}
                className="rounded-xl p-4 border transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ 
                  backgroundColor: `${category.color}15`,
                  borderColor: `${category.color}40`
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium text-sm">{category.category.replace(/_/g, ' ')}</h4>
                        <p className="text-[10px] text-white/50 mt-0.5">{category.type}</p>
                      </div>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
                        {category.lectures} lec
                      </span>
                    </div>
                    <div className="space-y-1">
                      {category.topics.map((topic, topicIndex) => (
                        <p key={topicIndex} className="text-xs text-white/60">
                          • {topic}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Info */}
      {clinical && (
        <div className="glass-card rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl text-white mb-4 gradient-text">Clinical Training</h3>
          <div className="space-y-4">
            {clinical.totalSessions && (
              <div className="flex items-center gap-2 text-white/70">
                <span className="text-2xl text-white font-bold">{clinical.totalSessions}</span>
                <span>clinical sessions</span>
              </div>
            )}
            {clinical.sessions && (
              <div className="flex items-center gap-2 text-white/70">
                <span className="text-2xl text-white font-bold">{clinical.sessions}</span>
                <span>practical sessions</span>
              </div>
            )}
            
            {clinical.skills && (
              <div>
                <h4 className="text-sm text-white/70 mb-3">Skills & Procedures:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {clinical.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white/70">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {clinical.practicals && (
              <div>
                <h4 className="text-sm text-white/70 mb-3">Practical Topics:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {clinical.practicals.map((practical, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <span className="text-sm text-white/80">{practical}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Midterm Content */}
      {subject.midtermContent && (
        <div className="glass-card rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl text-white mb-4 gradient-text">
            Midterm / Continuous Exam Content
          </h3>
          {Array.isArray(subject.midtermContent) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {subject.midtermContent.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg bg-teal-500/10 border border-teal-400/30 hover:bg-teal-500/15 transition-all"
                >
                  <Circle className="h-3 w-3 text-teal-400 flex-shrink-0 mt-1" />
                  <span className="text-sm text-white/80">{topic}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(subject.midtermContent).map(([region, topics]) => (
                <div key={region}>
                  <h4 className="text-lg text-white mb-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30">
                      {region}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {topics.map((topic: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 rounded-lg bg-teal-500/10 border border-teal-400/30 hover:bg-teal-500/15 transition-all"
                      >
                        <Circle className="h-3 w-3 text-teal-400 flex-shrink-0 mt-1" />
                        <span className="text-sm text-white/80">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
