<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => ['sometimes', 'required', 'string', 'max:5000'],
            'is_public' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'sometimes', 'file', 'mimes:jpg,jpeg,png,gif', 'max:5120'],
            'remove_image' => ['sometimes', 'boolean'],
        ];
    }
}
