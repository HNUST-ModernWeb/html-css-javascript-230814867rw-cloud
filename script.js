// 个人信息卡片页面 - JavaScript
// 高级Web课程第一次课堂作业

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const avatarInput = document.getElementById('avatarInput');
    const avatarDisplay = document.getElementById('avatarDisplay');
    const nameDisplay = document.getElementById('nameDisplay');
    const bioDisplay = document.getElementById('bioDisplay');
    const nameInput = document.getElementById('nameInput');
    const bioInput = document.getElementById('bioInput');
    
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const clearNameBtn = document.getElementById('clearNameBtn');
    const clearBioBtn = document.getElementById('clearBioBtn');
    
    const infoDisplay = document.getElementById('infoDisplay');
    const editSection = document.getElementById('editSection');
    
    const saveStatus = document.getElementById('saveStatus');
    const charCount = document.getElementById('charCount');
    const maxChars = document.getElementById('maxChars');
    const charCounter = document.querySelector('.char-counter');
    
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmSaveBtn = document.getElementById('confirmSaveBtn');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const dialogMessage = document.getElementById('dialogMessage');
    
    const themeBtns = document.querySelectorAll('.theme-btn');
    
    // 常量
    const MAX_BIO_LENGTH = 150;
    maxChars.textContent = MAX_BIO_LENGTH;
    
    // 当前状态
    let isEditing = false;
    let originalName = '';
    let originalBio = '';
    
    // 初始化
    init();
    
    function init() {
        // 加载本地存储数据
        loadFromLocalStorage();
        
        // 加载主题设置
        loadTheme();
        
        // 设置事件监听器
        setupEventListeners();
        
        // 初始字数统计
        updateCharCount();
    }
    
    // 设置事件监听器
    function setupEventListeners() {
        // 头像上传
        avatarInput.addEventListener('change', handleAvatarUpload);
        
        // 编辑按钮
        editBtn.addEventListener('click', function() {
            if (!isEditing) enterEditMode();
        });
        
        // 清除按钮
        clearNameBtn.addEventListener('click', function() {
            nameInput.value = '';
            nameInput.focus();
        });
        
        clearBioBtn.addEventListener('click', function() {
            bioInput.value = '';
            updateCharCount();
            bioInput.focus();
        });
        
        // 取消编辑
        cancelBtn.addEventListener('click', cancelEdit);
        
        // 保存按钮
        saveBtn.addEventListener('click', function() {
            const name = nameInput.value.trim();
            const bio = bioInput.value.trim();
            
            // 验证输入
            if (!name) {
                showMessage('请输入姓名！', 'error');
                nameInput.focus();
                return;
            }
            
            if (!bio) {
                showMessage('请输入个人简介！', 'error');
                bioInput.focus();
                return;
            }
            
            // 检查字数限制
            if (bio.length > MAX_BIO_LENGTH) {
                dialogMessage.textContent = '个人简介字数超限，请减少内容后再保存！';
                showConfirmDialog();
                return;
            }
            
            dialogMessage.textContent = '确定要保存个人信息吗？';
            showConfirmDialog();
        });
        
        // 确认保存
        confirmSaveBtn.addEventListener('click', confirmSave);
        
        // 取消确认
        cancelConfirmBtn.addEventListener('click', hideConfirmDialog);
        
        // 个人简介输入监听
        bioInput.addEventListener('input', updateCharCount);
        
        // 主题切换
        themeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const color = this.getAttribute('data-color');
                changeTheme(color, this);
            });
        });
        
        // 点击对话框外部关闭
        confirmDialog.addEventListener('click', function(e) {
            if (e.target === confirmDialog) hideConfirmDialog();
        });
        
        // ESC键关闭对话框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && confirmDialog.classList.contains('show')) {
                hideConfirmDialog();
            }
        });
    }
    
    // 头像上传处理
    function handleAvatarUpload() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            if (!file.type.match('image.*')) {
                showMessage('请选择图片文件！', 'error');
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                showMessage('图片大小不能超过2MB！', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarDisplay.src = e.target.result;
                showMessage('头像已更新！', 'success');
                saveToLocalStorage();
            };
            reader.readAsDataURL(file);
        }
    }
    
    // 进入编辑模式
    function enterEditMode() {
        isEditing = true;
        originalName = nameDisplay.textContent;
        originalBio = bioDisplay.textContent;
        
        nameInput.value = originalName;
        bioInput.value = originalBio;
        
        infoDisplay.style.display = 'none';
        editSection.style.display = 'block';
        editBtn.style.display = 'none';
        
        nameInput.focus();
        updateCharCount();
    }
    
    // 退出编辑模式
    function exitEditMode() {
        isEditing = false;
        infoDisplay.style.display = 'block';
        editSection.style.display = 'none';
        editBtn.style.display = 'flex';
    }
    
    // 取消编辑
    function cancelEdit() {
        nameInput.value = originalName;
        bioInput.value = originalBio;
        updateCharCount();
        exitEditMode();
        showMessage('已取消编辑', 'info');
    }
    
    // 更新字数统计
    function updateCharCount() {
        const count = bioInput.value.length;
        charCount.textContent = count;
        
        if (count > MAX_BIO_LENGTH) {
            bioInput.classList.add('over-limit');
            charCounter.classList.add('over-limit');
            charCount.style.color = '#e74c3c';
        } else {
            bioInput.classList.remove('over-limit');
            charCounter.classList.remove('over-limit');
            charCount.style.color = '';
        }
    }
    
    // 显示确认对话框
    function showConfirmDialog() {
        confirmDialog.classList.add('show');
    }
    
    // 隐藏确认对话框
    function hideConfirmDialog() {
        confirmDialog.classList.remove('show');
    }
    
    // 确认保存
    function confirmSave() {
        const name = nameInput.value.trim();
        const bio = bioInput.value.trim();
        
        // 再次检查字数限制
        if (bio.length > MAX_BIO_LENGTH) {
            showMessage('字数超限，无法保存！', 'error');
            hideConfirmDialog();
            bioInput.focus();
            return;
        }
        
        // 更新显示
        nameDisplay.textContent = name;
        bioDisplay.textContent = bio;
        
        // 退出编辑模式
        exitEditMode();
        
        // 显示成功消息
        showMessage('个人信息已保存！', 'success');
        
        // 隐藏对话框
        hideConfirmDialog();
        
        // 保存到本地存储
        saveToLocalStorage();
    }
    
    // 显示提示消息
    function showMessage(message, type) {
        saveStatus.textContent = '';
        saveStatus.className = 'status';
        saveStatus.textContent = message;
        saveStatus.classList.add('show');
        
        if (type === 'success') {
            saveStatus.style.backgroundColor = '#d4edda';
            saveStatus.style.color = '#155724';
            saveStatus.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            saveStatus.style.backgroundColor = '#f8d7da';
            saveStatus.style.color = '#721c24';
            saveStatus.style.border = '1px solid #f5c6cb';
        } else if (type === 'info') {
            saveStatus.style.backgroundColor = '#d1ecf1';
            saveStatus.style.color = '#0c5460';
            saveStatus.style.border = '1px solid #bee5eb';
        }
        
        setTimeout(function() {
            saveStatus.classList.remove('show');
        }, 3000);
    }
    
    // 保存到本地存储
    function saveToLocalStorage() {
        const data = {
            name: nameDisplay.textContent,
            bio: bioDisplay.textContent,
            avatar: avatarDisplay.src,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('personalInfo', JSON.stringify(data));
        } catch (e) {
            console.log('本地存储失败:', e);
        }
    }
    
    // 从本地存储加载
    function loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('personalInfo');
            if (saved) {
                const data = JSON.parse(saved);
                
                if (data.name) nameDisplay.textContent = data.name;
                if (data.bio) bioDisplay.textContent = data.bio;
                if (data.avatar) avatarDisplay.src = data.avatar;
            }
        } catch (e) {
            console.log('本地存储读取失败:', e);
        }
    }
    
    // 改变主题
    function changeTheme(color, button) {
        // 更新body的类
        document.body.className = '';
        document.body.classList.add(color + '-bg');
        
        // 更新按钮状态
        themeBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // 保存主题到本地存储
        localStorage.setItem('themeColor', color);
        
        // 显示提示
        const themeNames = {
            'default': '默认',
            'lightblue': '浅蓝',
            'lightgreen': '浅绿',
            'lightpink': '浅粉'
        };
        showMessage(`已切换到${themeNames[color]}主题`, 'info');
    }
    
    // 加载主题设置
    function loadTheme() {
        const savedTheme = localStorage.getItem('themeColor') || 'default';
        const themeBtn = document.querySelector(`.theme-btn[data-color="${savedTheme}"]`);
        
        if (themeBtn) {
            changeTheme(savedTheme, themeBtn);
        }
    }
});