<?php

namespace FilamentEditorJs\Forms\Components;

use Closure;
use Filament\Forms\Components\Concerns\HasFileAttachments;
use Filament\Forms\Components\Concerns\HasPlaceholder;
use Filament\Forms\Components\Contracts\HasFileAttachments as HasFileAttachmentsContract;
use Filament\Forms\Components\Field;
use FilamentEditorJs\Forms\Components\Concerns\InteractsWithTools;

class EditorJs extends Field implements HasFileAttachmentsContract
{
    use HasFileAttachments, HasPlaceholder, InteractsWithTools;

    protected string $view = 'filament-editorjs::forms.components.fields.editorjs';

    protected array | Closure $tools = [
        'attaches',
        'checklist',
        'code',
        'delimiter',
        'header',
        'image-gallery',
        'image',
        'inline-code',
        'link',
        'list',
        'marker',
        'nested-list',
        'paragraph',
        'quote',
        'raw',
        'style',
        'table',
        'underline',
        'warning',
        'embed',
        'footnotes',
        'simple-video',
        'strikethrough',
        'subscript',
        'superscript',
    ];

    protected array | Closure $toolsOptions = [];
    protected int | Closure | null $minHeight = 30;
    protected bool $debug = false;

    public function minHeight(int | Closure | null $minHeight): static
    {
        $this->minHeight = $minHeight;

        return $this;
    }

    public function getMinHeight(): ?int
    {
        return $this->evaluate($this->minHeight);
    }

    public function debug(bool $debug = true): static
    {
        $this->debug = $debug;

        return $this;
    }

    public function isDebugEnabled(): bool
    {
        return $this->debug;
    }
}
