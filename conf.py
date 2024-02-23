# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Kazumasa Ueno'
copyright = '2024, Kazumasa Ueno'
author = 'Kazumasa Ueno'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = []

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

language = 'ja'

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

# html_theme = 'scrolls'
# html_static_path = ['_static']

# import sphinx_theme_pd
# html_theme = 'sphinx_theme_pd'
# html_theme_path = [sphinx_theme_pd.get_html_theme_path()]
# import sphinx_theme_piccolo
html_theme = 'piccolo_theme'
# html_theme_path = [sphinx_theme_piccolo.get_html_theme_path()]

html_title = '上野和雅（Kazumasa Ueno）'