let current_file = null;
let preview_json = null;
let upload_dialog_open = false;

window.open_upload_dialog = () => {
  $upload_dialog.classList.remove('hidden');
  $container.classList.add('blurred');
  upload_dialog_open = true;
  paused = true;
};
window.close_upload_dialog = () => {
  $upload_dialog.classList.add('hidden');
  $container.classList.remove('blurred');
  upload_dialog_open = false;
  $upload_dialog_input.value = '';
  current_file = null;
  $upload_dialog_window_image.file = null;
  $upload_dialog_window_image.src = '';
  file_cleared();
  paused = false;
};

$upload_dialog.addEventListener('click', (e) => {
  if (e.clientX != 0 && e.clientY != 0)
    close_upload_dialog();
});

$upload_dialog_window.addEventListener('click', (e) => {
  e.stopPropagation();
});

$upload_button.addEventListener('click', () => {
  open_upload_dialog();
});
$upload_dialog_cancel_button.addEventListener('click', () => {
  close_upload_dialog();
});
$upload_dialog_upload_button.addEventListener('click', () => {
  if (preview_json) {
    fetch('/api/add-picture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preview_json)
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      close_upload_dialog();
    });
  }
});

const file_added = () => {
  $upload_dialog_placeholder.classList.add('hidden');
  $upload_dialog_window_image.classList.remove('hidden');
  $upload_dialog_placeholder.classList.remove('green');
  $upload_dialog_window_header.classList.remove('hidden');
  $upload_dialog_upload_button.classList.remove('disabled');
};
const file_cleared = () => {
  $upload_dialog_placeholder.classList.remove('hidden');
  $upload_dialog_window_image.classList.add('hidden');
  $upload_dialog_window_header.classList.add('hidden');
  $upload_dialog_upload_button.classList.add('disabled');
};
const get_preview = async (file, size, sigma) => {
  const formData = new FormData();
  formData.append('picture', file);
  // fetch('https://storage.googleapis.com/ln342000-test1/anotherTest.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=admin-30%40crucial-baton-342502.iam.gserviceaccount.com%2F20220226%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20220226T043755Z&X-Goog-Expires=900&X-Goog-SignedHeaders=content-type%3Bhost&X-Goog-Signature=034c7ffc5e7a14479a3e3ad00c4c2fc131895571b7350438d5d8babdfc51c79f237afb635284e37b44e4037899115fdce12e732931b78c6e3b7a12340f93535a6a9dc59f14a28359850d958843e96014016de808907d13d15f2d56b5dc8d9a810d82533ad46a3ed073c2c5685295047991177ced612d94823354feaba5edf10c32397c8811c9342ba8b81e211103ae2ac8d6523489db11aaaead672034127a5c8f4f355113b508b1e1f6e07f514c61ab4d6b39a7ce4496723b0fc0ce256c29857b8ee37026a3311203df190d6405f8c724c21db62c2113939969edc2f6af0566cc9df856601e89a086ba422bac687c572f048ee67e0cd63490721d2b2a89b0d7', {
  //   method: 'PUT',
  //   body: current_file
  // })
  fetch('/api/get-picture-preview?size=' + size + '&sigma=' + sigma, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(json => {
    console.log(json);
    if (!json.error) {
      preview_json = json;
      // console.log(`preview_json: ${JSON.stringify(preview_json)}`);
      // $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.outline}`;
      switch (selected_button) {
        case $upload_dialog_header_modes_original_button:
          $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/original.${preview_json.extension}`;
          break;
        case $upload_dialog_header_modes_outline_button:
          $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/outline.${preview_json.extension}`;
          break;
        case $upload_dialog_header_modes_details_button:
          $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/details.${preview_json.extension}`;
          break;
      }
    } else {
      // $upload_dialog_message.innerText = json.error;
      // $upload_dialog_message.classList.remove('hidden');
      $upload_dialog_placeholder.classList.remove('green');
      $upload_dialog_placeholder_text.innerText = 'Drag and drop a picture here.\nClick here to select a picture to upload.\nPress ctrl/command + v to paste.';
      // setTimeout(() => {
      //   $upload_dialog_message.classList.add('hidden');
      // }, 3000);
    }
  });
}

let seconds_since_size_change = 0;
let seconds_since_sigma_change = 0;
let last_size_interval = null;
let last_sigma_interval = null;
$kernel_size_slider.addEventListener('input', (e) => {
  seconds_since_size_change = 0;
  $upload_dialog_window_image.classList.add('getting-preview');
  $upload_dialog_upload_button.classList.add('disabled');
  if (last_size_interval)
    clearInterval(last_size_interval);
  let interval = setInterval(() => {
    seconds_since_size_change += 1;
    console.log(seconds_since_size_change);
    if (seconds_since_size_change >= 1) {
      console.log(`kernel size: ${$kernel_size_slider.value}`);
      get_preview(current_file, $kernel_size_slider.value, $kernel_sigma_slider.value);
      clearInterval(interval);
    }
  }, 1000);
  last_size_interval = interval;
});
$kernel_sigma_slider.addEventListener('input', (e) => {
  seconds_since_sigma_change = 0;
  $upload_dialog_window_image.classList.add('getting-preview');
  $upload_dialog_upload_button.classList.add('disabled');
  if (last_sigma_interval)
    clearInterval(last_sigma_interval);
  let interval = setInterval(() => {
    seconds_since_sigma_change += 1;
    console.log(seconds_since_sigma_change);
    if (seconds_since_sigma_change >= 1) {
      console.log(`kernel sigma: ${$kernel_sigma_slider.value}`);
      get_preview(current_file, $kernel_size_slider.value, $kernel_sigma_slider.value);
      clearInterval(interval);
    }
  }, 1000);
  last_sigma_interval = interval;
});
function handleFile(file) {
  if (!file || !file.type || !file.type.match('image.*')) {
    $upload_dialog_placeholder.classList.remove('green');
    return;
  }
  let old_text = $upload_dialog_placeholder_text.innerHTML;
  $upload_dialog_placeholder_text.innerHTML = 'Uploading...';
  $upload_dialog_window_header.classList.add('disabled');
  $upload_dialog_upload_button.classList.add('disabled');
  $upload_dialog_window_image.classList.add('hidden');
  $upload_dialog_placeholder.classList.remove('hidden');
  current_file = file;
  $upload_dialog_window_image.file = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    let image = new Image();
    image.src = e.target.result;
    image.onload = () => {
      const max_dimension = 2000;
      const max_kernel = Math.min(Math.max(image.width, image.height), max_dimension);
      $kernel_size_slider.max = max_kernel;
      $kernel_sigma_slider.max = 50;
      $kernel_size_slider.value = $kernel_size_slider.max * 1;
      $kernel_sigma_slider.value = 4;
      get_preview(file, $kernel_size_slider.value, $kernel_sigma_slider.value).then(() => {
        $upload_dialog_window_image.onload = () => {
          $upload_dialog_window_header.classList.remove('disabled');
          $upload_dialog_upload_button.classList.remove('disabled');
          $upload_dialog_placeholder.classList.add('hidden');
          $upload_dialog_placeholder_text.innerHTML = old_text;
          $upload_dialog_window_image.classList.remove('hidden');
          $upload_dialog_window_header.classList.remove('hidden');
          $upload_dialog_placeholder.classList.remove('green');
          $upload_dialog_window_image.classList.remove('getting-preview');
        };
      });
    };
  };
  reader.readAsDataURL(file);
}
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
  $upload_dialog_placeholder.classList.add('green');
}
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
  $upload_dialog_placeholder.classList.add('green');
}
function dragleave(e) {
  e.stopPropagation();
  e.preventDefault();
  $upload_dialog_placeholder.classList.remove('green');
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  const dt = e.dataTransfer;
  const file = dt.files[0];
  handleFile(file);
}
$upload_dialog_input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleFile(file);
});
$upload_dialog_dropbox.addEventListener('dragenter', dragenter, false);
$upload_dialog_dropbox.addEventListener('dragover', dragover, false);
$upload_dialog_dropbox.addEventListener('drop', drop, false);
$upload_dialog_dropbox.addEventListener('dragleave', dragleave, false);

// upload dialog mode buttons
let selected_button = $upload_dialog_header_modes_outline_button;
$upload_dialog_header_modes_original_button.addEventListener('click', () => {
  selected_button.classList.remove('selected-mode');
  selected_button = $upload_dialog_header_modes_original_button;
  selected_button.classList.add('selected-mode');
  $upload_dialog_window_image.classList.add('getting-preview');
  $upload_dialog_upload_button.classList.add('disabled');
  $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/original.${preview_json.extension}`;
  $upload_dialog_window_image.onload = () => {
    $upload_dialog_window_image.classList.remove('getting-preview');
    $upload_dialog_upload_button.classList.remove('disabled');
  }
});
$upload_dialog_header_modes_outline_button.addEventListener('click', () => {
  selected_button.classList.remove('selected-mode');
  selected_button = $upload_dialog_header_modes_outline_button;
  selected_button.classList.add('selected-mode');
  $upload_dialog_window_image.classList.add('getting-preview');
  $upload_dialog_upload_button.classList.add('disabled');
  $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/outline.${preview_json.extension}`;
  $upload_dialog_window_image.onload = () => {
    $upload_dialog_window_image.classList.remove('getting-preview');
    $upload_dialog_upload_button.classList.remove('disabled');
  }
});
$upload_dialog_header_modes_details_button.addEventListener('click', () => {
  selected_button.classList.remove('selected-mode');
  selected_button = $upload_dialog_header_modes_details_button;
  selected_button.classList.add('selected-mode');
  $upload_dialog_window_image.classList.add('getting-preview');
  $upload_dialog_upload_button.classList.add('disabled');
  $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/details.${preview_json.extension}`;
  $upload_dialog_window_image.onload = () => {
    $upload_dialog_window_image.classList.remove('getting-preview');
    $upload_dialog_upload_button.classList.remove('disabled');
  }
});
window.addEventListener('paste', e => {
  const files = e.clipboardData.files;
  if (files.length > 0 && !$upload_dialog.classList.contains('hidden')) {
    handleFile(files[0]);
  }
});