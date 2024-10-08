import AttachesTool from '@editorjs/attaches';
import Checklist from '@editorjs/checklist';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import FootnotesTune from '@editorjs/footnotes';
import Header from '@editorjs/header';
import ImageGallery from 'editorjs-gallery';
import ImageTool from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import NestedList from '@editorjs/nested-list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import RawTool from '@editorjs/raw';
import Table from '@editorjs/table';
import SimpleVideo from 'simple-video-editorjs';
import Strikethrough from 'editorjs-strikethrough';
import Subscript from 'editorjs-subscript';
import Superscript from 'editorjs-superscript';
import Underline from '@editorjs/underline';
import Warning from '@editorjs/warning';
import DragDrop from 'editorjs-drag-drop';
import { StyleInlineTool } from 'editorjs-style';
import Undo from 'editorjs-undo';

document.addEventListener('alpine:init', () => {
    Alpine.data(
        'editorjs',
        ({ state, statePath, placeholder, readOnly, debugEnabled, tools, toolsOptions, minHeight }) => ({
            instance: null,
            state: state,
            tools: tools,
            uploadImage: function (blob) {
                return new Promise((resolve) => {
                    this.$wire.upload(
                        `componentFileAttachments.${statePath}`,
                        blob,
                        (uploadedFilename) => {
                            this.$wire
                                .getComponentFileAttachmentUrl(statePath)
                                .then((url) => {
                                    if (!url) {
                                        return resolve({
                                            success: 0,
                                        });
                                    }
                                    return resolve({
                                        success: 1,
                                        file: {
                                            url: url,
                                        },
                                    });
                                });
                        }
                    );
                });
            },
            log: (...args) => debugEnabled && console.log(...args),
            init() {
                let enabledTools = {};

                this.log('EditorJS Alpine component initialized');
                this.log('State path:', statePath);
                this.log('State:', state);
                this.log('Placeholder:', placeholder);
                this.log('Read only:', readOnly);
                this.log('Tools:', tools);
                this.log('Tools options:', toolsOptions);
                this.log('Min height:', minHeight);

                if (this.tools.includes('attaches')) {
                    if (!toolsOptions.hasOwnProperty('attaches')) {
                        toolsOptions.attaches = {};
                        console.warn('You have enabled the attaches tool but have not provided any options. The attaches tool will not work without options.');
                    }

                    enabledTools.attaches = {
                        class: AttachesTool,
                        config: {
                            // TODO: uploader with Livewire
                            ...toolsOptions.attaches,
                        },
                    };
                }

                if (this.tools.includes('checklist')) {
                    enabledTools.checklist = {
                        class: Checklist,
                        inlineToolbar: true,
                    };
                }

                if (this.tools.includes('code')) {
                    const codeToolConfig = toolsOptions.hasOwnProperty('code') ? toolsOptions.code : {};
                    const codeToolDefaultConfig = {};

                    enabledTools.code = {
                        class: Code,
                        config: {
                            ...codeToolDefaultConfig,
                            ...codeToolConfig,
                        },
                    };
                }

                if (this.tools.includes('delimiter')) {
                    enabledTools.delimiter = Delimiter;
                }

                if (this.tools.includes('embed')) {
                    enabledTools.embed = {
                        class: Embed,
                        services: {
                            twitter: true,
                            vimeo: true,
                            youtube: true,
                        },        
                    };
                }

                if (this.tools.includes('footnotes')) {
                    enabledTools.footnotes = {
                        class: FootnotesTune,
                    };
                }
                
                if (this.tools.includes('header')) {
                    const headerToolConfig = toolsOptions.hasOwnProperty('header') ? toolsOptions.header : {};
                    const headerToolDefaultConfig = {};

                    enabledTools.header = {
                        class: Header,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+H',
                        config: {
                            ...headerToolDefaultConfig,
                            ...headerToolConfig,
                        },
                    };
                }

                if (this.tools.includes('image')) {
                    const imageToolConfig = toolsOptions.hasOwnProperty('image') ? toolsOptions.image : {};
                    const imageToolDefaultConfig = {
                        uploader: {
                            uploadByFile: (file) => this.uploadImage(file),
                            uploadByUrl: (url) => {
                                return new Promise(async (resolve) => {
                                    return fetch(url)
                                        .then((res) => res.blob())
                                        .then((blob) => resolve(this.uploadImage(blob)));
                                });
                            },
                        },
                    };

                    if (imageToolConfig.hasOwnProperty('endpoints')) {
                        delete imageToolDefaultConfig.uploader;
                    }

                    enabledTools.image = {
                        class: ImageTool,
                        config: {
                            ...imageToolDefaultConfig,
                            ...imageToolConfig,
                        },
                    };
                }

                if (this.tools.includes('image-gallery')) {
                    const imageGalleryToolConfig = toolsOptions.hasOwnProperty('image-gallery') ? toolsOptions['image-gallery'] : {};
                    const imageGalleryToolDefaultConfig = {
                        uploader: {
                            uploadByFile: (file) => this.uploadImage(file),
                            uploadByUrl: (url) => {
                                return new Promise(async (resolve) => {
                                    return fetch(url)
                                        .then((res) => res.blob())
                                        .then((blob) => resolve(this.uploadImage(blob)));
                                });
                            },
                        },
                    };

                    if (imageGalleryToolConfig.hasOwnProperty('endpoints')) {
                        delete imageGalleryToolDefaultConfig.uploader;
                    }

                    enabledTools.imageGallery = {
                        class: ImageGallery,
                        config: {
                            ...imageGalleryToolDefaultConfig,
                            ...imageGalleryToolConfig,
                        },
                    };
                }

                if (this.tools.includes('inline-code')) {
                    enabledTools.inlineCode = InlineCode;
                }

                if (this.tools.includes('link')) {
                    if (!toolsOptions.hasOwnProperty('link')) {
                        toolsOptions.link = {};
                        console.warn('You have enabled the link tool but have not provided any options. The link tool will not work without options.');
                    }

                    enabledTools.linkTool = {
                        class: LinkTool,
                        config: {
                            ...toolsOptions.link,
                        },
                    };
                }

                if (this.tools.includes('list')) {
                    const listToolConfig = toolsOptions.hasOwnProperty('list') ? toolsOptions.list : {};
                    const listToolDefaultConfig = {
                        defaultStyle: 'ordered'
                    };

                    enabledTools.list = {
                        class: List,
                        inlineToolbar: true,
                        config: {
                            ...listToolDefaultConfig,
                            ...listToolConfig,
                        },
                    };
                }

                if (this.tools.includes('marker')) {
                    enabledTools.Marker = {
                        class: Marker,
                        shortcut: 'CMD+SHIFT+M',
                    };
                }

                if (this.tools.includes('nested-list')) {
                    const nestedListToolConfig = toolsOptions.hasOwnProperty('nested-list') ? toolsOptions['nested-list'] : {};
                    const nestedListToolDefaultConfig = {
                        defaultStyle: 'unordered'
                    };

                    enabledTools.list = {
                        class: NestedList,
                        config: {
                            ...nestedListToolConfig,
                            ...nestedListToolDefaultConfig,
                        }
                    };
                }

                if (this.tools.includes('paragraph')) {
                    const paragraphToolConfig = toolsOptions.hasOwnProperty('paragraph') ? toolsOptions.paragraph : {};
                    const paragraphToolDefaultConfig = {};

                    enabledTools.paragraph = {
                        class: Paragraph,
                        inlineToolbar: true,
                        config: {
                            ...paragraphToolDefaultConfig,
                            ...paragraphToolConfig,
                        },
                    };
                }

                if (this.tools.includes('quote')) {
                    const quoteToolConfig = toolsOptions.hasOwnProperty('quote') ? toolsOptions.quote : {};
                    const quoteToolDefaultConfig = {};

                    enabledTools.quote = {
                        class: Quote,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+O',
                        config: {
                            ...quoteToolDefaultConfig,
                            ...quoteToolConfig,
                        },
                    };
                }

                if (this.tools.includes('raw')) {
                    const rawToolConfig = toolsOptions.hasOwnProperty('raw') ? toolsOptions.raw : {};
                    const rawToolDefaultConfig = {};

                    enabledTools.raw = {
                        class: RawTool,
                        config: {
                            ...rawToolDefaultConfig,
                            ...rawToolConfig,
                        },
                    };
                }

                if (this.tools.includes('style')) {
                    enabledTools.style = StyleInlineTool;
                }

                if (this.tools.includes('table')) {
                    const tableToolConfig = toolsOptions.hasOwnProperty('table') ? toolsOptions.table : {};
                    const tableToolDefaultConfig = {};

                    enabledTools.table = {
                        class: Table,
                        inlineToolbar: true,
                        config: {
                            ...tableToolDefaultConfig,
                            ...tableToolConfig,
                        },
                    };
                }

                if (this.tools.includes('underline')) {
                    enabledTools.underline = Underline;
                }

                if (this.tools.includes('simple-video')) {
                    enabledTools.video = {
                        class: SimpleVideo,
                    };
                }

                if (this.tools.includes('strikethrough')) {
                    enabledTools.strikethrough = {
                        class: Strikethrough,
                        shortcut: 'CMD+SHIFT+X',
                    };
                }

                if (this.tools.includes('subscript')) {
                    enabledTools.subscript = {
                        class: Subscript,
                    };
                }

                if (this.tools.includes('superscript')) {
                    enabledTools.superscript = {
                        class: Superscript,
                    };
                }

                this.instance = new EditorJS({
                    holder: this.$el,
                    minHeight: minHeight,
                    data: this.state,
                    placeholder: placeholder,
                    readOnly: readOnly,
                    tools: enabledTools,

                    onChange: () => {
                        this.instance
                            .save()
                            .then((outputData) => {
                                this.state = outputData;
                            });
                    },

                    onReady: () => {
                        const editor = this.instance;
                        new Undo({ editor });
                        new DragDrop(editor);
                    },
                });
            },
        })
    );
});
