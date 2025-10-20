// Admin Inventory Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const inventoryForm = document.getElementById('inventory-form');
    const inventoryList = document.getElementById('inventory-list');
    const editIdInput = document.getElementById('edit-id');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const saveProductBtn = document.getElementById('save-product');
    
    // Form inputs
    const productName = document.getElementById('product-name');
    const productCategory = document.getElementById('product-category');
    const quantitySent = document.getElementById('quantity-sent');
    const quantityRemaining = document.getElementById('quantity-remaining');
    const totalStock = document.getElementById('total-stock');
    const productUnit = document.getElementById('product-unit');

    let editingId = null;

    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = '/admin/login';
        return;
    }

    // Load inventory on page load
    loadInventory();

    // Form submission
    inventoryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveProduct();
    });

    // Cancel edit
    cancelEditBtn.addEventListener('click', function() {
        resetForm();
    });

    // Auto-calculate total stock
    quantitySent.addEventListener('input', calculateTotal);
    quantityRemaining.addEventListener('input', calculateTotal);

    function calculateTotal() {
        const sent = parseFloat(quantitySent.value) || 0;
        const remaining = parseFloat(quantityRemaining.value) || 0;
        totalStock.value = sent + remaining;
    }

    async function loadInventory() {
        const token = localStorage.getItem('admin_token');
        try {
            const response = await fetch('/api/admin/inventory', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const inventory = await response.json();
                displayInventory(inventory);
            } else if (response.status === 401) {
                handleAuthError();
                return;
            } else {
                showNotification('❌ Error al cargar inventario', 'error');
            }
        } catch (error) {
            console.error('Error loading inventory:', error);
            showNotification('❌ Error de conexión al cargar inventario', 'error');
        }
    }

    function displayInventory(inventory) {
        if (!inventory || inventory.length === 0) {
            inventoryList.innerHTML = `
                <div class="text-center text-gray-400 py-8">
                    <p>📦 No hay productos en el inventario</p>
                    <p class="text-sm">Agrega tu primer producto usando el formulario</p>
                </div>
            `;
            return;
        }

        // Group by category
        const groupedInventory = inventory.reduce((groups, item) => {
            const category = item.category || 'general';
            if (!groups[category]) groups[category] = [];
            groups[category].push(item);
            return groups;
        }, {});

        const categoryEmojis = {
            panes: '🥖',
            verduras: '🥬',
            carnes: '🥩',
            quesos: '🧀',
            bebidas: '🥤',
            dinero: '💰',
            general: '📦'
        };

        let html = '';
        
        Object.entries(groupedInventory).forEach(([category, items]) => {
            const emoji = categoryEmojis[category] || '📦';
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            
            html += `
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-orange-400 mb-3 border-b border-gray-600 pb-2">
                        ${emoji} ${categoryName}
                    </h3>
                    <div class="space-y-2">
            `;
            
            items.forEach(item => {
                const stockStatus = getStockStatus(item.quantity_remaining, item.total_stock);
                html += createInventoryItemHTML(item, stockStatus);
            });
            
            html += `
                    </div>
                </div>
            `;
        });

        inventoryList.innerHTML = html;

        // Add event listeners to edit and delete buttons
        addInventoryEventListeners();
    }

    function createInventoryItemHTML(item, stockStatus) {
        return `
            <div class="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <h4 class="font-bold text-white">${item.name}</h4>
                        <div class="text-sm text-gray-300 mt-1">
                            <span class="inline-block mr-4">
                                📦 Enviada: <strong>${item.quantity_sent} ${item.unit}</strong>
                            </span>
                            <span class="inline-block mr-4">
                                📋 Restante: <strong class="${stockStatus.class}">${item.quantity_remaining} ${item.unit}</strong>
                            </span>
                            <span class="inline-block">
                                🏪 Total: <strong>${item.total_stock} ${item.unit}</strong>
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2 ml-4">
                        <button class="edit-btn bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" 
                                data-id="${item.id}">
                            ✏️ Editar
                        </button>
                        <button class="delete-btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm" 
                                data-id="${item.id}" data-name="${item.name}">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
                
                ${stockStatus.message ? `<div class="text-sm ${stockStatus.messageClass} mt-2">${stockStatus.message}</div>` : ''}
                
                <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-600">
                    <span class="text-xs text-gray-400">
                        Actualizado: ${new Date(item.updated_at).toLocaleDateString('es-MX')}
                    </span>
                    <div class="w-full max-w-xs bg-gray-600 rounded-full h-2 ml-4">
                        <div class="bg-gradient-to-r ${stockStatus.barClass} h-2 rounded-full transition-all duration-300" 
                             style="width: ${stockStatus.percentage}%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function getStockStatus(remaining, total) {
        const percentage = total > 0 ? (remaining / total) * 100 : 0;
        
        if (percentage === 0) {
            return {
                class: 'text-red-400',
                percentage: 0,
                barClass: 'from-red-500 to-red-600',
                message: '⚠️ Sin existencias',
                messageClass: 'text-red-400'
            };
        } else if (percentage <= 20) {
            return {
                class: 'text-orange-400',
                percentage,
                barClass: 'from-orange-500 to-red-500',
                message: '⚠️ Stock bajo',
                messageClass: 'text-orange-400'
            };
        } else if (percentage <= 50) {
            return {
                class: 'text-yellow-400',
                percentage,
                barClass: 'from-yellow-500 to-orange-500',
                message: '',
                messageClass: ''
            };
        } else {
            return {
                class: 'text-green-400',
                percentage,
                barClass: 'from-green-500 to-blue-500',
                message: '',
                messageClass: ''
            };
        }
    }

    function addInventoryEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.dataset.id;
                await editProduct(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.dataset.id;
                const name = this.dataset.name;
                
                if (confirm(`¿Estás seguro de que deseas eliminar "${name}" del inventario?`)) {
                    await deleteProduct(id);
                }
            });
        });
    }

    async function saveProduct() {
        const formData = {
            name: productName.value.trim(),
            category: productCategory.value,
            quantity_sent: parseInt(quantitySent.value) || 0,
            quantity_remaining: parseInt(quantityRemaining.value) || 0,
            total_stock: parseInt(totalStock.value) || 0,
            unit: productUnit.value
        };

        if (!formData.name) {
            showNotification('❌ El nombre del producto es requerido', 'error');
            productName.focus();
            return;
        }

        try {
            const token = localStorage.getItem('admin_token');
            const url = editingId ? `/api/admin/inventory/${editingId}` : '/api/admin/inventory';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const action = editingId ? 'actualizado' : 'agregado';
                showNotification(`✅ Producto ${action} exitosamente`, 'success');
                resetForm();
                await loadInventory();
            } else if (response.status === 401) {
                handleAuthError();
                return;
            } else {
                const error = await response.json();
                showNotification(`❌ Error: ${error.message || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            showNotification('❌ Error de conexión al guardar producto', 'error');
        }
    }

    async function editProduct(id) {
        const token = localStorage.getItem('admin_token');
        try {
            const response = await fetch(`/api/admin/inventory/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const product = await response.json();
                
                editingId = id;
                editIdInput.value = id;
                productName.value = product.name;
                productCategory.value = product.category;
                quantitySent.value = product.quantity_sent;
                quantityRemaining.value = product.quantity_remaining;
                totalStock.value = product.total_stock;
                productUnit.value = product.unit;
                
                saveProductBtn.textContent = '📝 Actualizar Producto';
                cancelEditBtn.classList.remove('hidden');
                
                // Scroll to form
                document.getElementById('inventory-form').scrollIntoView({ behavior: 'smooth' });
                productName.focus();
                
            } else if (response.status === 401) {
                handleAuthError();
                return;
            } else {
                showNotification('❌ Error al cargar producto para edición', 'error');
            }
        } catch (error) {
            console.error('Error editing product:', error);
            showNotification('❌ Error de conexión al cargar producto', 'error');
        }
    }

    async function deleteProduct(id) {
        const token = localStorage.getItem('admin_token');
        try {
            const response = await fetch(`/api/admin/inventory/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                showNotification('✅ Producto eliminado exitosamente', 'success');
                await loadInventory();
                
                // If we were editing this product, reset the form
                if (editingId === id) {
                    resetForm();
                }
            } else if (response.status === 401) {
                handleAuthError();
                return;
            } else {
                const error = await response.json();
                showNotification(`❌ Error al eliminar: ${error.message || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('❌ Error de conexión al eliminar producto', 'error');
        }
    }

    function resetForm() {
        editingId = null;
        editIdInput.value = '';
        inventoryForm.reset();
        saveProductBtn.textContent = '💾 Guardar Producto';
        cancelEditBtn.classList.add('hidden');
        productName.focus();
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white max-w-sm`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    // Handle 401 errors (token expired/invalid)
    function handleAuthError() {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
    }

    // Add logout functionality
    function addLogoutButton() {
        const navButtons = document.querySelector('.space-x-4');
        if (navButtons) {
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700';
            logoutBtn.textContent = '🚪 Salir';
            logoutBtn.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
            };
            navButtons.appendChild(logoutBtn);
        }
    }

    // Add logout button to navigation
    addLogoutButton();

    // Initialize form
    productName.focus();
});