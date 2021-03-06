class PaginationListLinkRenderer < WillPaginate::ActionView::LinkRenderer

  protected

  def page_number(page)
    unless page == current_page
      tag(:li, link(page, page, :class => 'fnpu-link', :rel => rel_value(page)))
    else
      tag(:li, page, :class => "current")
    end
  end

  def previous_or_next_page(page, text, classname)
    if page
      tag(:li, link(text, page, :class => 'fnpu-link'), :class => classname)
    else
      tag(:li, text, :class => classname + ' disabled')
    end
  end

  def html_container(html)
    tag(:ul, html, container_attributes)
  end

  def merge_get_params(url_params)
    if @template.respond_to? :request and @template.request and @template.request.get?
      symbolized_update(url_params, @template.params)
    end
    # url_params.slice!(:param_to_remove_1, :param_to_remove_2)
    url_params.except(:fnpu)
  end

end
