import React, { useContext, useMemo, useState, useEffect } from 'react';
import { HabitContext } from '../App';
import { HabitContextType, Folder, Todo, Habit, COLOR_MAP } from '../types';
import { FolderIcon, PlusIcon, PencilIcon, TrashIcon, ChevronLeftIcon, Bars4Icon } from './icons';
import { iconMap } from './icons';
import TodoItem from './TodoItem';
import AddFolderModal from './Modal';
import AddTodoModal from './AddItemModal';
import AddHabitModal from './AddHabitModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

// --- Reusable Components ---
const FolderCard: React.FC<{ folder: Folder, count: number, onClick: () => void, onEdit: () => void, onDelete: () => void, style: React.CSSProperties }> = ({ folder, count, onClick, onEdit, onDelete, style }) => {
    const colors = COLOR_MAP[folder.color] ?? COLOR_MAP.gray;

    return (
        <button onClick={onClick} className={`rounded-2xl shadow-sm p-4 flex flex-col h-full text-left w-full transition-transform hover:scale-105 ${colors.lightBg} animate-fade-in-up`} style={style}>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg inline-block ${colors.bg}`}>
                        <FolderIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"><PencilIcon className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                </div>
                <h3 className="text-xl font-bold mt-3 text-gray-800 dark:text-gray-100">{folder.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[20px]">{folder.description}</p>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-4">{count} item{count !== 1 ? 's' : ''}</p>
        </button>
    );
};

const ItemListItem: React.FC<{
    item: Todo | Habit,
    type: 'task' | 'habit',
    onEdit: () => void,
    onDelete: () => void,
    style: React.CSSProperties,
    isDragged: boolean,
    onDragStart: (e: React.DragEvent, id: string) => void,
    onDragOver: (e: React.DragEvent) => void,
    onDrop: (e: React.DragEvent, id: string) => void,
    onDragEnd: () => void,
}> = ({ item, type, onEdit, onDelete, style, isDragged, onDragStart, onDragOver, onDrop, onDragEnd }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onDragOver={(e) => { e.preventDefault(); onDragOver(e); setIsDragOver(true); }}
            onDrop={(e) => { e.preventDefault(); onDrop(e, item.id); setIsDragOver(false); }}
            onDragEnd={() => { onDragEnd(); setIsDragOver(false); }}
            onDragLeave={() => setIsDragOver(false)}
            className={`relative flex items-center gap-2 group p-2 rounded-lg transition-all duration-150 animate-fade-in-up ${isDragged ? 'opacity-30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
            style={style}
        >
            {isDragOver && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />}
            <span className="text-gray-400 cursor-grab touch-none">
                <Bars4Icon className="w-5 h-5" />
            </span>
            <div className="flex-grow">
                {type === 'task' ? <TodoItem todo={item as Todo} isReadOnly /> : (() => {
                    const habit = item as Habit;
                    const IconComponent = iconMap[habit.icon] || iconMap['book'];
                    const colors = COLOR_MAP[habit.color] ?? COLOR_MAP['gray'];
                    return (
                        <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors.bg}`}>
                                <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{ habit.name }</span>
                        </div>
                    );
                })()}
            </div>
            <button onClick={onEdit} className="text-gray-400 hover:text-[#7C3AED] transition-opacity opacity-0 group-hover:opacity-100 p-2" aria-label="Edit item">
                <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100 p-2" aria-label="Delete item">
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

const FolderDetailView: React.FC<{
    folder: Folder;
    onBack: () => void;
    onAddItem: () => void;
    children: React.ReactNode;
}> = ({ folder, onBack, onAddItem, children }) => (
    <div className="space-y-6 animate-fade-in pb-20">
        <header className="h-16 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1 text-[#7C3AED] dark:text-[#A78BFA] font-semibold p-2 rounded-lg hover:bg-[#7C3AED]/10 dark:hover:bg-[#7C3AED]/20">
                <ChevronLeftIcon className="w-5 h-5"/>
                Back
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate px-2">{folder.name}</h1>
            <button onClick={onAddItem} className="bg-[#7C3AED] text-white p-2.5 rounded-full shadow-md hover:bg-[#6D28D9] transition-transform transform hover:scale-110 active:scale-95" aria-label="Add new item to folder">
                <PlusIcon className="w-5 h-5"/>
            </button>
        </header>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-2">
            {children}
        </div>
    </div>
);


// --- Main View ---
const OrganizeView: React.FC = () => {
    const context = useContext(HabitContext) as HabitContextType;
    const { setIsModalOpen } = context;
    const [activeTab, setActiveTab] = useState<'habits' | 'tasks'>('habits');
    
    // State for modals and selections
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [isAddingItemToFolder, setIsAddingItemToFolder] = useState(false);
    const [editingItem, setEditingItem] = useState<Habit | Todo | null>(null);
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string, type: 'habit' | 'task' | 'folder' } | null>(null);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const isEditing = useMemo(() => !!editingItem || !!editingFolder, [editingItem, editingFolder]);
    
    useEffect(() => {
        setIsModalOpen(isEditing);
    }, [isEditing, setIsModalOpen]);


    // --- Derived Data (Habits) ---
    const habitsInSelectedFolder = useMemo(() => context.habits.filter(item => item.folderId === selectedFolderId), [context.habits, selectedFolderId]);
    const uncategorizedHabits = useMemo(() => context.habits.filter(item => !item.folderId), [context.habits]);
    const selectedHabitFolder = useMemo(() => selectedFolderId ? context.getHabitFolderById(selectedFolderId) : null, [selectedFolderId, context.getHabitFolderById]);

    // --- Derived Data (Tasks) ---
    const todosInSelectedFolder = useMemo(() => context.todos.filter(item => item.folderId === selectedFolderId), [context.todos, selectedFolderId]);
    const uncategorizedTodos = useMemo(() => context.todos.filter(item => !item.folderId), [context.todos]);
    const selectedTaskFolder = useMemo(() => selectedFolderId ? context.getTaskFolderById(selectedFolderId) : null, [selectedFolderId, context.getTaskFolderById]);
    

    // --- Handlers ---
    const confirmDeletion = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'folder' && activeTab === 'habits') {
            context.deleteHabitFolder(itemToDelete.id);
        } else if (itemToDelete.type === 'folder' && activeTab === 'tasks') {
            context.deleteTaskFolder(itemToDelete.id);
        } else if (itemToDelete.type === 'habit') {
            context.deleteHabit(itemToDelete.id);
        } else if (itemToDelete.type === 'task') {
            context.deleteTodo(itemToDelete.id);
        }
        setItemToDelete(null);
    };

    const handleTabChange = (tab: 'habits' | 'tasks') => {
        setSelectedFolderId(null);
        setEditingFolder(null);
        setEditingItem(null);
        setActiveTab(tab);
    }

     // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItemId(id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (draggedItemId && draggedItemId !== targetId) {
            if (activeTab === 'habits') {
                context.reorderHabits(draggedItemId, targetId);
            } else {
                context.reorderTodos(draggedItemId, targetId);
            }
        }
        setDraggedItemId(null);
    };

    const handleDragEnd = () => {
        setDraggedItemId(null);
    };

    // --- Sub-View for selected folder ---
    if (selectedFolderId) {
        if (activeTab === 'habits' && selectedHabitFolder) {
            return (
                <>
                    <FolderDetailView folder={selectedHabitFolder} onBack={() => setSelectedFolderId(null)} onAddItem={() => setIsAddingItemToFolder(true)}>
                        {habitsInSelectedFolder.length > 0 ? (
                            habitsInSelectedFolder.map((habit, index) => 
                                <ItemListItem 
                                    key={habit.id}
                                    item={habit}
                                    type="habit"
                                    onEdit={() => setEditingItem(habit)}
                                    onDelete={() => setItemToDelete({ id: habit.id, name: habit.name, type: 'habit' })}
                                    style={{animationDelay: `${index * 30}ms`, opacity: 0}}
                                    isDragged={draggedItemId === habit.id}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onDragEnd={handleDragEnd}
                                />
                            )
                        ) : (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No habits in this folder yet.</p>
                        )}
                    </FolderDetailView>
                    {isAddingItemToFolder && <AddHabitModal onClose={() => setIsAddingItemToFolder(false)} preselectedFolderId={selectedFolderId} />}
                </>
            );
        }
        if (activeTab === 'tasks' && selectedTaskFolder) {
            return (
                <>
                    <FolderDetailView folder={selectedTaskFolder} onBack={() => setSelectedFolderId(null)} onAddItem={() => setIsAddingItemToFolder(true)}>
                        {todosInSelectedFolder.length > 0 ? (
                            todosInSelectedFolder.map((todo, index) => 
                                <ItemListItem 
                                    key={todo.id}
                                    item={todo}
                                    type="task"
                                    onEdit={() => setEditingItem(todo)}
                                    onDelete={() => setItemToDelete({ id: todo.id, name: todo.text, type: 'task' })}
                                    style={{animationDelay: `${index * 30}ms`, opacity: 0}}
                                    isDragged={draggedItemId === todo.id}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onDragEnd={handleDragEnd}
                                />
                            )
                        ) : (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No tasks in this folder yet.</p>
                        )}
                    </FolderDetailView>
                    {isAddingItemToFolder && <AddTodoModal onClose={() => setIsAddingItemToFolder(false)} preselectedFolderId={selectedFolderId} />}
                </>
            );
        }
    }
    
    // --- Main View (Folder lists) ---
    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Modals */}
            {editingItem && (activeTab === 'habits' ? <AddHabitModal onClose={() => setEditingItem(null)} habitToEdit={editingItem as Habit} /> : <AddTodoModal onClose={() => setEditingItem(null)} todoToEdit={editingItem as Todo} />)}
            {editingFolder && <AddFolderModal type={activeTab === 'habits' ? 'habit' : 'task'} onClose={() => setEditingFolder(null)} folderToEdit={editingFolder} />}
            {itemToDelete && (
                <ConfirmDeleteModal 
                    onCancel={() => setItemToDelete(null)}
                    onConfirm={confirmDeletion}
                    title={`Delete ${itemToDelete.type}`}
                    message={`Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`}
                />
            )}


            <header className="h-16 flex items-center justify-center relative">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Organize</h1>
            </header>

            <div className="bg-white dark:bg-gray-800 p-1 rounded-full flex gap-1 shadow-sm">
                <button onClick={() => handleTabChange('habits')} className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${activeTab === 'habits' ? 'bg-[#7C3AED] text-white' : 'text-gray-500 hover:bg-[#7C3AED]/10 dark:hover:bg-gray-700'}`}>Habits</button>
                <button onClick={() => handleTabChange('tasks')} className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${activeTab === 'tasks' ? 'bg-[#7C3AED] text-white' : 'text-gray-500 hover:bg-[#7C3AED]/10 dark:hover:bg-gray-700'}`}>Tasks</button>
            </div>
            
            { activeTab === 'habits' ? (
                <>
                    <section>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Folders</h2>
                            <button onClick={() => context.openAddFolderModal('habit')} className="flex items-center gap-1 bg-[#7C3AED]/20 dark:bg-[#7C3AED]/30 text-[#5B21B6] dark:text-[#A78BFA] font-semibold px-3 py-1.5 rounded-full text-xs hover:bg-[#7C3AED]/30 dark:hover:bg-[#7C3AED]/40">
                                <PlusIcon className="w-4 h-4" /> Add Folder
                            </button>
                        </div>
                        {context.habitFolders.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {context.habitFolders.map((folder, index) => {
                                    const count = context.habits.filter(item => item.folderId === folder.id).length;
                                    return (
                                        <FolderCard
                                            key={folder.id}
                                            folder={folder}
                                            count={count}
                                            onClick={() => setSelectedFolderId(folder.id)}
                                            onEdit={() => setEditingFolder(folder)}
                                            onDelete={() => setItemToDelete({ id: folder.id, name: folder.name, type: 'folder' })}
                                            style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No folders yet.</p>
                        )}
                    </section>
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Uncategorized Habits</h2>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-2">
                             {uncategorizedHabits.length > 0 ? (
                                uncategorizedHabits.map((item, index) => (
                                    <ItemListItem
                                        key={item.id}
                                        item={item}
                                        type={'habit'}
                                        onEdit={() => setEditingItem(item)}
                                        onDelete={() => setItemToDelete({ id: item.id, name: item.name, type: 'habit' })}
                                        style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}
                                        isDragged={draggedItemId === item.id}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onDragEnd={handleDragEnd}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No uncategorized habits.</p>
                            )}
                        </div>
                    </section>
                </>
            ) : (
                 <>
                    <section>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Folders</h2>
                            <button onClick={() => context.openAddFolderModal('task')} className="flex items-center gap-1 bg-[#7C3AED]/20 dark:bg-[#7C3AED]/30 text-[#5B21B6] dark:text-[#A78BFA] font-semibold px-3 py-1.5 rounded-full text-xs hover:bg-[#7C3AED]/30 dark:hover:bg-[#7C3AED]/40">
                                <PlusIcon className="w-4 h-4" /> Add Folder
                            </button>
                        </div>
                        {context.taskFolders.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {context.taskFolders.map((folder, index) => {
                                    const count = context.todos.filter(item => item.folderId === folder.id).length;
                                    return (
                                        <FolderCard
                                            key={folder.id}
                                            folder={folder}
                                            count={count}
                                            onClick={() => setSelectedFolderId(folder.id)}
                                            onEdit={() => setEditingFolder(folder)}
                                            onDelete={() => setItemToDelete({ id: folder.id, name: folder.name, type: 'folder' })}
                                            style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                             <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No folders yet.</p>
                        )}
                    </section>
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Uncategorized Tasks</h2>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-2">
                             {uncategorizedTodos.length > 0 ? (
                                uncategorizedTodos.map((item, index) => (
                                    <ItemListItem
                                        key={item.id}
                                        item={item}
                                        type={'task'}
                                        onEdit={() => setEditingItem(item)}
                                        onDelete={() => setItemToDelete({ id: item.id, name: item.text, type: 'task' })}
                                        style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}
                                        isDragged={draggedItemId === item.id}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onDragEnd={handleDragEnd}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No uncategorized tasks.</p>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default OrganizeView;
