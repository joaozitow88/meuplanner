import React, { useState } from 'react';
import { 
  Timer, Upload, Search, Filter, Plus, Edit2, Trash2, 
  ChevronDown, ChevronRight, Clock, CheckCircle, XCircle, 
  Percent, AlertCircle, BookOpen, X, Play, Pause, RotateCcw
} from 'lucide-react';
import { PomodoroTimer } from '../components/PomodoroTimer';

interface PDF {
  id: string;
  weekId: string;
  weekName: string;
  majorArea: string;
  topicId: string;
  topicName: string;
  fileName: string;
  uploadDate: Date;
}

interface Question {
  number: number;
  isCorrect: boolean | null;
}

const mockPDFs: PDF[] = [
  {
    id: '1',
    weekId: '1',
    weekName: 'Semana 1',
    majorArea: 'CLM',
    topicId: '1',
    topicName: 'Ventilação Mecânica',
    fileName: 'questoes-vm-1.pdf',
    uploadDate: new Date(),
  },
  {
    id: '2',
    weekId: '1',
    weekName: 'Semana 1',
    majorArea: 'CIR',
    topicId: '2',
    topicName: 'Anestesia Geral',
    fileName: 'questoes-anestesia-1.pdf',
    uploadDate: new Date(),
  },
];

export function Questions() {
  const [pdfs, setPDFs] = useState<PDF[]>(mockPDFs);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);
  const [pdfToEdit, setPdfToEdit] = useState<PDF | null>(null);
  const [isAnswerBarCollapsed, setIsAnswerBarCollapsed] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [startingQuestion, setStartingQuestion] = useState(1);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [editForm, setEditForm] = useState({
    weekId: '',
    weekName: '',
    majorArea: '',
    topicId: '',
    topicName: '',
    fileName: '',
  });

  const handleEditPDF = (pdf: PDF) => {
    setPdfToEdit(pdf);
    setEditForm({
      weekId: pdf.weekId,
      weekName: pdf.weekName,
      majorArea: pdf.majorArea,
      topicId: pdf.topicId,
      topicName: pdf.topicName,
      fileName: pdf.fileName,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!pdfToEdit) return;
    
    setPDFs(prev => prev.map(pdf => 
      pdf.id === pdfToEdit.id 
        ? { ...pdf, ...editForm }
        : pdf
    ));
    
    setIsEditModalOpen(false);
    setPdfToEdit(null);
  };

  const handleDeletePDF = (pdfId: string) => {
    if (confirm('Tem certeza que deseja excluir este PDF?')) {
      setPDFs(prev => prev.filter(pdf => pdf.id !== pdfId));
      if (selectedPDF?.id === pdfId) {
        setSelectedPDF(null);
      }
    }
  };

  // Filter PDFs based on search and filters
  const filteredPDFs = pdfs.filter(pdf => {
    const searchMatch = 
      pdf.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.majorArea.toLowerCase().includes(searchTerm.toLowerCase());

    const weekMatch = !selectedWeek || pdf.weekId === selectedWeek;
    const areaMatch = !selectedArea || pdf.majorArea === selectedArea;
    const topicMatch = !selectedTopic || pdf.topicId === selectedTopic;

    return searchMatch && weekMatch && areaMatch && topicMatch;
  });

  const handleStartQuestions = () => {
    if (!totalQuestions) return;
    
    const newQuestions = Array.from({ length: totalQuestions }, (_, i) => ({
      number: startingQuestion + i,
      isCorrect: null
    }));
    
    setQuestions(newQuestions);
    setIsTimerRunning(true);
  };

  const handleAnswerQuestion = (index: number, isCorrect: boolean) => {
    setQuestions(prev => 
      prev.map((q, i) => i === index ? { ...q, isCorrect } : q)
    );
  };

  const getPerformanceStats = () => {
    const answered = questions.filter(q => q.isCorrect !== null).length;
    const correct = questions.filter(q => q.isCorrect).length;
    const incorrect = questions.filter(q => q.isCorrect === false).length;
    const percentage = answered ? (correct / answered) * 100 : 0;

    return { answered, correct, incorrect, percentage };
  };

  const getFeedbackEmoji = (percentage: number) => {
    if (percentage >= 76) return '😄';
    if (percentage >= 70) return '🙂';
    if (percentage >= 65) return '🤔';
    return '😔';
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Questões</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar PDFs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>Adicionar PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2"
        >
          <option value="">Todas as Semanas</option>
          <option value="1">Semana 1</option>
          <option value="2">Semana 2</option>
        </select>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2"
        >
          <option value="">Todas as Áreas</option>
          <option value="CIR">Cirurgia</option>
          <option value="CLM">Clínica Médica</option>
          <option value="GO">GO</option>
          <option value="PREV">Preventiva</option>
          <option value="PED">Pediatria</option>
        </select>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2"
        >
          <option value="">Todos os Tópicos</option>
          <option value="1">Ventilação Mecânica</option>
          <option value="2">Anestesia Geral</option>
        </select>
      </div>

      {/* PDFs List */}
      {!selectedPDF && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-6 text-sm font-medium text-gray-400 pb-4 border-b border-gray-700">
            <div className="col-span-2">Nome do Arquivo</div>
            <div>Semana</div>
            <div>Grande Área</div>
            <div>Tópico</div>
            <div className="text-right">Ações</div>
          </div>
          <div className="space-y-2 mt-4">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="grid grid-cols-6 items-center py-3 hover:bg-gray-700 rounded-lg px-4">
                <div className="col-span-2 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-400" />
                  <span>{pdf.fileName}</span>
                </div>
                <div>{pdf.weekName}</div>
                <div>{pdf.majorArea}</div>
                <div>{pdf.topicName}</div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedPDF(pdf)}
                    className="p-2 hover:bg-indigo-600 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => handleEditPDF(pdf)}
                    className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeletePDF(pdf.id)}
                    className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Viewer and Answer Bar */}
      {selectedPDF && (
        <div className="flex gap-6">
          {/* PDF Viewer */}
          <div className={`flex-1 space-y-6 transition-all duration-300 ${
            isAnswerBarCollapsed ? 'mr-16' : 'mr-80'
          }`}>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{selectedPDF.fileName}</h3>
                <button
                  onClick={() => setSelectedPDF(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg h-[600px] flex items-center justify-center">
                <p className="text-gray-400">PDF Viewer aqui</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Anotações</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 bg-gray-700 rounded-lg p-4 resize-none"
                placeholder="Digite suas anotações aqui..."
              />
            </div>
          </div>

          {/* Answer Bar */}
          <div
            className={`fixed right-0 top-0 bottom-0 w-80 bg-gray-800 shadow-xl transition-transform duration-300 ${
              isAnswerBarCollapsed ? 'translate-x-64' : 'translate-x-0'
            }`}
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Gabarito</h3>
                <button
                  onClick={() => setIsAnswerBarCollapsed(!isAnswerBarCollapsed)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronRight
                    size={24}
                    className={`transform transition-transform ${
                      isAnswerBarCollapsed ? '' : 'rotate-180'
                    }`}
                  />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {questions.length === 0 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Número de Questões
                      </label>
                      <input
                        type="number"
                        value={totalQuestions}
                        onChange={(e) => setTotalQuestions(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Questão Inicial
                      </label>
                      <input
                        type="number"
                        value={startingQuestion}
                        onChange={(e) => setStartingQuestion(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2"
                        min="1"
                      />
                    </div>

                    <button
                      onClick={handleStartQuestions}
                      disabled={!totalQuestions}
                      className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      Começar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">
                        {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                          className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button
                          onClick={() => setElapsedTime(0)}
                          className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <RotateCcw size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {questions.map((question, index) => (
                        <div
                          key={question.number}
                          className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg"
                        >
                          <span className="font-medium">{question.number}</span>
                          <div className="flex-1 flex gap-2">
                            <button
                              onClick={() => handleAnswerQuestion(index, true)}
                              className={`flex-1 p-2 rounded ${
                                question.isCorrect === true
                                  ? 'bg-green-600'
                                  : 'bg-gray-600 hover:bg-gray-500'
                              }`}
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button
                              onClick={() => handleAnswerQuestion(index, false)}
                              className={`flex-1 p-2 rounded ${
                                question.isCorrect === false
                                  ? 'bg-red-600'
                                  : 'bg-gray-600 hover:bg-gray-500'
                              }`}
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {questions.some(q => q.isCorrect !== null) && (
                      <div className="pt-4 border-t border-gray-700">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Questões Respondidas:</span>
                            <span>{getPerformanceStats().answered}/{questions.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Acertos:</span>
                            <span className="text-green-400">{getPerformanceStats().correct}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Erros:</span>
                            <span className="text-red-400">{getPerformanceStats().incorrect}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Desempenho:</span>
                            <div className="flex items-center gap-2">
                              <span>{getPerformanceStats().percentage.toFixed(1)}%</span>
                              <span className="text-2xl">
                                {getFeedbackEmoji(getPerformanceStats().percentage)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Adicionar PDF</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Semana</label>
                <select className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  <option value="">Selecione uma semana</option>
                  <option value="1">Semana 1</option>
                  <option value="2">Semana 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Grande Área</label>
                <select className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  <option value="">Selecione uma área</option>
                  <option value="CIR">Cirurgia</option>
                  <option value="CLM">Clínica Médica</option>
                  <option value="GO">GO</option>
                  <option value="PREV">Preventiva</option>
                  <option value="PED">Pediatria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tópico</label>
                <select className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  <option value="">Selecione um tópico</option>
                  <option value="1">Ventilação Mecânica</option>
                  <option value="2">Anestesia Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Arquivo PDF</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 mb-2">Arraste um arquivo PDF ou</p>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                    Escolher Arquivo
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit PDF Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Editar PDF</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Semana</label>
                <select
                  value={editForm.weekId}
                  onChange={(e) => setEditForm(prev => ({ ...prev, weekId: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Selecione uma semana</option>
                  <option value="1">Semana 1</option>
                  <option value="2">Semana 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Grande Área</label>
                <select
                  value={editForm.majorArea}
                  onChange={(e) => setEditForm(prev => ({ ...prev, majorArea: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Selecione uma área</option>
                  <option value="CIR">Cirurgia</option>
                  <option value="CLM">Clínica Médica</option>
                  <option value="GO">GO</option>
                  <option value="PREV">Preventiva</option>
                  <option value="PED">Pediatria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tópico</label>
                <select
                  value={editForm.topicId}
                  onChange={(e) => setEditForm(prev => ({ ...prev, topicId: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Selecione um tópico</option>
                  <option value="1">Ventilação Mecânica</option>
                  <option value="2">Anestesia Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome do Arquivo</label>
                <input
                  type="text"
                  value={editForm.fileName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fileName: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro Timer Button */}
      <button
        onClick={() => setIsPomodoroOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
      >
        <Timer size={24} />
      </button>

      {/* Pomodoro Timer Modal */}
      {isPomodoroOpen && (
        <PomodoroTimer onClose={() => setIsPomodoroOpen(false)} />
      )}
    </div>
  );
}