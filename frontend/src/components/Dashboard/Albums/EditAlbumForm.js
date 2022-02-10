import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { deleteImages, patchAlbum, patchAlbumWithImageDel } from '../../../store/dashboard';

import './AlbumEditForm.css'

export default function EditAlbumForm({ album }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(album.title || '');
  const [description, setDescription] = useState(album.description || '');
  const [multiValue, setMultiValue] = useState([{ value: 'hey', label: 'bruh'}]);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  const [imageIds, setImageIds] = useState();
  console.log('albuM: ', album)

  useEffect(() => {
    setErrors([]);
    const errors = [];

    if (title.length > 30 || !title.length) {
      errors.push('Image title must be between 1 and 30 characters');
    }
    if (description.length > 300) {
      errors.push('Description must be less than 300 characters');
    }
    if (title === album.title && (
      (!description && !album.description) || description === album.description)
    ) {
      errors.push('No changes have been made')
    }

    setErrors(errors);
  }, [title, description, album])


  const handleMultiChange = (option) => {
    setMultiValue({ option })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (!errors.length) {
      const payload = {
        title,
        description,
        albumId: album.id,
        imageIds: multiValue.option?.map(value => value.value)
      };

      if (payload.imageIds && payload.imageIds.length) {
        return dispatch(patchAlbumWithImageDel(payload))
      }
      console.log('payload: ', payload)
      return dispatch(patchAlbum(payload));
    }

    setShowErrors(true);
  };


  const options = album.images.map(image => (
    {
      value: image.id,
      label: <div><img src={image.imageUrl} height='30px' width='30px' alt='select img' />{image.title}</div>
    }
  ))

  return (
    <form onSubmit={handleSubmit} className='edit-album-form'>
      <h2>Edit Album</h2>
      <ul>
        {showErrors && errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label>Title</label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <label>Description</label>
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <label>Remove Image(s)</label>
      {/* <select
      >
        {album.images?.map(image => (
          <option
            key={image.id}>{image.title}
            style={{backgroundImage: `url(${image.imageUrl})`}}
          </option>
        ))}
      </select> */}
      <Select
        values={multiValue}
        className='select'
        options={options}
        onChange={handleMultiChange}
        isMulti
        closeMenuOnSelect={false}
      />
      <button>Submit Changes</button>
    </form>
  )
}
