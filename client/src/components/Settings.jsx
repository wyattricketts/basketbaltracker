import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const Settings = () => {
    const {
        customParameters,
        addCustomParameter,
        updateCustomParameter,
        deleteCustomParameter,
        clearAllShots,
        shots,
        exportData,
        importData
    } = useAppContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParameter, setEditingParameter] = useState(null);
    const fileInputRef = useRef(null);

    const handleAddParameter = () => {
        setEditingParameter(null);
        setIsModalOpen(true);
    };

    const handleEditParameter = (param) => {
        setEditingParameter(param);
        setIsModalOpen(true);
    };

    const handleSaveParameter = (parameterData) => {
        if (editingParameter) {
            updateCustomParameter(editingParameter.id, parameterData);
        } else {
            addCustomParameter(parameterData);
        }
        setIsModalOpen(false);
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const success = importData(e.target.result);
                if (success) {
                    alert('Data imported successfully!');
                } else {
                    alert('Error importing data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    const getStorageInfo = () => {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
            }
        }
        return {
            used: (totalSize / 1024).toFixed(2), // KB
            shotsCount: shots.length,
            lastSaved: localStorage.getItem('lastSaved')
        };
    };

    const storageInfo = getStorageInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Settings</h1>
                    <p className="text-gray-600">Customize your shot tracking parameters</p>
                </div>

                {/* Data Management Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Management</h2>

                    {/* Storage Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">Total Shots</h3>
                            <p className="text-2xl font-bold text-blue-600">{storageInfo.shotsCount}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                            <h3 className="font-semibold text-green-800 mb-2">Storage Used</h3>
                            <p className="text-2xl font-bold text-green-600">{storageInfo.used} KB</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4">
                            <h3 className="font-semibold text-purple-800 mb-2">Last Saved</h3>
                            <p className="text-sm font-medium text-purple-600">
                                {storageInfo.lastSaved ? new Date(storageInfo.lastSaved).toLocaleString() : 'Never'}
                            </p>
                        </div>
                    </div>

                    {/* Backup/Restore Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={exportData}
                            className="bg-green-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>💾</span>
                            Export Backup
                        </button>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📁</span>
                            Import Backup
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete all shot data? This cannot be undone.')) {
                                    clearAllShots();
                                }
                            }}
                            className="bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>🗑️</span>
                            Clear All Data
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        style={{ display: 'none' }}
                    />

                    {/* Auto-save indicator */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <span className="text-green-600 font-semibold">✓ Auto-save enabled</span> - Your data is automatically saved as you work
                        </p>
                    </div>
                </div>

                {/* Custom Parameters Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Custom Parameters</h2>
                        <button
                            onClick={handleAddParameter}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            + Add Parameter
                        </button>
                    </div>

                    {/* Parameters List */}
                    {customParameters.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-6xl mb-4">⚙️</div>
                            <p className="text-lg">No custom parameters yet.</p>
                            <p>Click "Add Parameter" to create your first custom tracking field.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {customParameters.map((param) => (
                                <div
                                    key={param.id}
                                    className="bg-gray-50 rounded-xl p-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            {param.icon} {param.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Type: {param.type === 'categorical' ? 'Categorical' : 'Numeric'}
                                        </p>
                                        {param.type === 'categorical' && param.options && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Options: {param.options.join(', ')}
                                            </p>
                                        )}
                                        {param.type === 'numeric' && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Range: {param.min} - {param.max}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditParameter(param)}
                                            className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCustomParameter(param.id)}
                                            className="bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Parameter Modal */}
                <ParameterModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveParameter}
                    editingParameter={editingParameter}
                />
            </div>
        </div>
    );
};

// Parameter Modal component (same as before, just moved here)
const ParameterModal = ({ isOpen, onClose, onSave, editingParameter }) => {
    const [parameterData, setParameterData] = useState({
        name: '',
        icon: '📊',
        type: 'categorical',
        options: [''],
        min: 0,
        max: 10
    });

    useEffect(() => {
        if (editingParameter) {
            setParameterData(editingParameter);
        } else {
            setParameterData({
                name: '',
                icon: '📊',
                type: 'categorical',
                options: [''],
                min: 0,
                max: 10
            });
        }
    }, [editingParameter, isOpen]);

    const availableIcons = ['📊', '🎯', '⚡', '🛡️', '🏀', '📍', '🔢', '⭐', '🎪', '🎨', '🎵', '🎮'];

    const handleAddOption = () => {
        setParameterData(prev => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };

    const handleRemoveOption = (index) => {
        setParameterData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleOptionChange = (index, value) => {
        setParameterData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => i === index ? value : opt)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (parameterData.name.trim() === '') return;

        if (parameterData.type === 'categorical') {
            const validOptions = parameterData.options.filter(opt => opt.trim() !== '');
            if (validOptions.length === 0) return;
            onSave({ ...parameterData, options: validOptions });
        } else {
            onSave(parameterData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            {editingParameter ? 'Edit Parameter' : 'Create Custom Parameter'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="px-6 py-6 max-h-96 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Parameter Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Parameter Name
                            </label>
                            <input
                                type="text"
                                value={parameterData.name}
                                onChange={(e) => setParameterData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                placeholder="e.g., Player Position"
                                required
                            />
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Icon
                            </label>
                            <div className="grid grid-cols-6 gap-2">
                                {availableIcons.map(icon => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setParameterData(prev => ({ ...prev, icon }))}
                                        className={`p-3 text-2xl rounded-lg border-2 transition-all ${parameterData.icon === icon
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Parameter Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Parameter Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setParameterData(prev => ({ ...prev, type: 'categorical' }))}
                                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${parameterData.type === 'categorical'
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                        }`}
                                >
                                    Categorical
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setParameterData(prev => ({ ...prev, type: 'numeric' }))}
                                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${parameterData.type === 'numeric'
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                        }`}
                                >
                                    Numeric
                                </button>
                            </div>
                        </div>

                        {/* Categorical Options */}
                        {parameterData.type === 'categorical' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Options
                                </label>
                                <div className="space-y-2">
                                    {parameterData.options.map((option, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                                                placeholder={`Option ${index + 1}`}
                                            />
                                            {parameterData.options.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(index)}
                                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                                    >
                                        + Add Option
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Numeric Range */}
                        {parameterData.type === 'numeric' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Min Value
                                    </label>
                                    <input
                                        type="number"
                                        value={parameterData.min}
                                        onChange={(e) => setParameterData(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Max Value
                                    </label>
                                    <input
                                        type="number"
                                        value={parameterData.max}
                                        onChange={(e) => setParameterData(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                        {editingParameter ? 'Update' : 'Create'} Parameter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;