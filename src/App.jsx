import { useReducer, useState } from 'react';

const initialState = [
  { id: 1, title: 'Sample todo 1', completed: false },
  { id: 2, title: 'Sample todo 2', completed: true },
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        { id: Date.now(), title: action.payload, completed: false },
        ...state,
      ];
    case 'TOGGLE_COMPLETE':
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    case 'EDIT_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, title: action.payload.title }
          : todo
      );
    default:
      return state;
  }
}

export default function App() {
  const [todos, dispatch] = useReducer(todoReducer, initialState);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      dispatch({ type: 'ADD_TODO', payload: newTodo });
      setNewTodo('');
    }
  };

  const handleEditTodo = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const handleSaveTodo = () => {
    dispatch({
      type: 'EDIT_TODO',
      payload: { id: editingId, title: editingText },
    });
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div className='min-h-screen bg-gray-200 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-6 text-blue-600'>
          Todo List
        </h1>

        <div className='flex mb-6'>
          <input
            type='text'
            className='flex-grow border rounded-l px-4 py-2 focus:outline-none'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='Add a new todo'
          />
          <button
            onClick={handleAddTodo}
            className='bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700'
          >
            Add
          </button>
        </div>

        <ul className='space-y-3'>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex justify-between items-center p-3 border rounded ${
                todo.completed ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {editingId === todo.id ? (
                <div className='flex-grow flex'>
                  <input
                    type='text'
                    className='flex-grow border px-2 py-1'
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button
                    onClick={handleSaveTodo}
                    className='ml-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700'
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-grow cursor-pointer ${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}
                    onClick={() =>
                      dispatch({ type: 'TOGGLE_COMPLETE', payload: todo.id })
                    }
                  >
                    {todo.title}
                  </span>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className='bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        dispatch({ type: 'DELETE_TODO', payload: todo.id })
                      }
                      className={`${
                        todo.completed
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-300 cursor-not-allowed'
                      } text-white px-2 py-1 rounded`}
                      disabled={!todo.completed}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
